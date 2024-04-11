import React from 'react';
import Script from 'next/script';

// global.d.ts
declare global {
    interface Window {
       aclib: any; // You can replace 'any' with a more specific type if you know the structure of 'aclib'
    }
}

const AdSense = () => {
    const runAclib = () => {
        if (window.aclib) {
            window.aclib.runAutoTag({
                zoneId: 'abmvkgjtfs',
            });
        } else {
            // Optionally, you can set a timeout to retry after a delay
            setTimeout(runAclib, 100); // Retry after 100ms
        }
    };

    return (
        <>
            <div>
            <Script
                    src="https://acscdn.com/script/aclib.js"
                    strategy="beforeInteractive"
                />
            </div>
        </>
    );
}

export default AdSense;