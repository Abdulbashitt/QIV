// ==========================================
// UNIVERSAL DOWNLOAD HANDLER - PASTE INTO script.js
// Works on iOS, Android, Windows, Mac
// Handles Cloudinary cross-origin URLs
// ==========================================

class DownloadManager {
    constructor() {
        this.isProcessing = false;
        this.init();
    }

    init() {
        // Attach download handlers to all download buttons
        document.querySelectorAll('.download-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleDownload(e, btn));
        });

        // Attach share handlers to all share buttons
        document.querySelectorAll('.share-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleShare(e, btn));
        });
    }

    async handleDownload(e, button) {
        e.preventDefault();

        if (this.isProcessing) return;
        this.isProcessing = true;

        const imageUrl = button.dataset.imageUrl;
        const imageName = button.dataset.imageName || this.extractFilename(imageUrl);

        // Show loading state
        button.disabled = true;
        const originalText = button.innerHTML;
        button.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg> Downloading...';

        try {
            // APPROACH 1: Fetch as blob (most reliable)
            const blob = await this.fetchImageAsBlob(imageUrl);
            
            if (blob) {
                // Create download link from blob
                this.triggerDownload(blob, imageName);
                this.showStatus('success', 'Downloaded successfully!');
                this.isProcessing = false;
                this.resetButton(button, originalText);
                return;
            }
        } catch (err) {
            console.warn('Blob download failed, trying alternative...', err);
        }

        try {
            // APPROACH 2: Direct browser download (fallback)
            this.triggerDirectDownload(imageUrl, imageName);
            this.showStatus('success', 'Opening download...');
            this.isProcessing = false;
            this.resetButton(button, originalText);
            return;
        } catch (err) {
            console.error('Download failed:', err);
            this.showStatus('error', 'Download failed. Please try again.');
        }

        this.isProcessing = false;
        this.resetButton(button, originalText);
    }

    async fetchImageAsBlob(url) {
        try {
            // Add timestamp to bypass cache
            const cacheBuster = `?cb=${Date.now()}`;
            const response = await fetch(url + cacheBuster, {
                mode: 'cors',
                credentials: 'omit',
                headers: {
                    'Accept': 'image/*'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.blob();
        } catch (err) {
            console.error('Fetch blob error:', err);
            return null;
        }
    }

    triggerDownload(blob, filename) {
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        
        // Append to body (required for some browsers)
        document.body.appendChild(link);
        
        // Trigger click
        link.click();
        
        // Cleanup
        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
        }, 100);
    }

    triggerDirectDownload(url, filename) {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.setAttribute('target', '_blank');
        
        document.body.appendChild(link);
        link.click();
        
        setTimeout(() => {
            document.body.removeChild(link);
        }, 100);
    }

    extractFilename(url) {
        try {
            const urlObj = new URL(url);
            const pathname = urlObj.pathname;
            const filename = pathname.substring(pathname.lastIndexOf('/') + 1);
            return filename || 'wallpaper.webp';
        } catch {
            return 'wallpaper.webp';
        }
    }

    resetButton(button, originalHTML) {
        button.disabled = false;
        button.innerHTML = originalHTML;
    }

    async handleShare(e, button) {
        e.preventDefault();
        
        const shareUrl = button.dataset.shareUrl;
        const title = 'Check out this wallpaper!';
        const text = 'Amazing wallpaper for your phone';

        // Use native Web Share API if available
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: text,
                    url: shareUrl
                });
                this.showStatus('success', 'Shared successfully!');
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('Share failed:', err);
                }
            }
        } else {
            // Fallback: Copy link to clipboard
            try {
                await navigator.clipboard.writeText(shareUrl);
                this.showStatus('success', 'Link copied to clipboard!');
            } catch {
                this.showStatus('error', 'Could not share. Please try manually.');
            }
        }
    }

    showStatus(type, message) {
        // Remove existing message
        const existing = document.querySelector('.status-message');
        if (existing) existing.remove();

        // Create message
        const msg = document.createElement('div');
        msg.className = `status-message ${type}`;
        msg.textContent = message;
        document.body.appendChild(msg);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            msg.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => msg.remove(), 300);
        }, 3000);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new DownloadManager();
    });
} else {
    new DownloadManager();
}

// Add spin animation for loading state
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);
