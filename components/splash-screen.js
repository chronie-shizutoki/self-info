/**
 * Manages the loading screen display.
 */
class LoadingScreen {
    constructor(elementId = 'loading-screen') {
        this.loadingScreen = document.getElementById(elementId);

        if (!this.loadingScreen) {
            console.error(`Loading screen element with ID "${elementId}" not found.`);
            return;
        }

        // Show loading screen initially
        this.show();

        // Hide loading screen after a delay
        setTimeout(() => {
            this.hide();
        }, 2000); // Show loading screen for 2 seconds
    }

    /**
     * Shows the loading screen.
     */
    show() {
        this.loadingScreen.classList.remove('hidden');
    }

    /**
     * Hides the loading screen.
     */
    hide() {
        this.loadingScreen.classList.add('hidden');
    }
}

// Instantiate the class once the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LoadingScreen();
});


