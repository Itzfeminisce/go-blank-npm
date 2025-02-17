import axios from 'axios';
import './style.css';

export interface IWebsite {
  _id: string;
  url: string;
  status: "inactive" | "active";
  description: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

const API_URL = "https://go-blank.vercel.app/api/website";

// Track created elements for cleanup
let styleElement: HTMLStyleElement | null = null;
let overlayElement: HTMLDivElement | null = null;

export const initWebsiteBlanker = async () => {
  try {
    const currentUrl = window.location.href;
    const hostname = window.location.hostname;

    const response = await axios.get<IWebsite[]>(API_URL, {
      headers: { 'Content-Type': 'application/json' }
    });

    // More precise matching logic
    const website = response.data.find(it => 
      it.url === currentUrl || 
      it.url.includes(hostname) ||
      currentUrl.includes(it.url)
    );

    // Clear any existing overlay first
    removeBlankEffect();

    if (website && website.status === "active") {
      applyBlankEffect();
    }

  } catch (error) {
    console.error('Website status check failed:', error);
    // Optional: Add visual error feedback
  }
};

const applyBlankEffect = () => {
  // Create style element if not exists
  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.innerHTML = `
      .website-blanker-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: white;
        z-index: 2147483647; /* Maximum z-index */
        opacity: 0;
        animation: fadeIn 5s forwards;
        pointer-events: none;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `;
    document.head.appendChild(styleElement);
  }

  // Create overlay element if not exists
  if (!overlayElement) {
    overlayElement = document.createElement('div');
    overlayElement.className = 'website-blanker-overlay';
    document.body.appendChild(overlayElement);
  }
};

const removeBlankEffect = () => {
  if (styleElement) {
    document.head.removeChild(styleElement);
    styleElement = null;
  }
  if (overlayElement) {
    document.body.removeChild(overlayElement);
    overlayElement = null;
  }
};

// Optional: Add cleanup method for SPA navigation
export const cleanupWebsiteBlanker = () => {
  removeBlankEffect();
};