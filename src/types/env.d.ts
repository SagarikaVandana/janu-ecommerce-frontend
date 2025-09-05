// Extend the Window interface to include ENV
declare global {
  interface Window {
    ENV?: {
      NEXT_PUBLIC_API_URL?: string;
    };
  }
}

export {};
