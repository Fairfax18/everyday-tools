'use client';
import { useEffect } from 'react';

export default function AdBanner({ dataAdSlot, dataAdFormat = 'auto', dataFullWidthResponsive = true }) {
  useEffect(() => {
    // This pushes the command to Google to fill the ad slot once the component mounts
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error("AdSense error:", error);
    }
  }, []);

  return (
    <div className="w-full flex justify-center my-8 overflow-hidden rounded-xl border border-neutral-100 dark:border-neutral-800/50 bg-neutral-50 dark:bg-neutral-900/20">
      <div className="text-[10px] text-center text-neutral-400 uppercase tracking-widest pt-2 w-full absolute">Sponsored</div>
      <ins
        className="adsbygoogle w-full z-10 pt-6"
        style={{ display: 'block' }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID}
        data-ad-slot={dataAdSlot}
        data-ad-format={dataAdFormat}
        data-full-width-responsive={dataFullWidthResponsive.toString()}
      />
    </div>
  );
}