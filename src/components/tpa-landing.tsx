"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { PublicInquiry } from "./public-inquiry";
import type { ReactNode } from "react";

export function TpaLanding({html, signedIn, staff, media}: {html:string; signedIn:boolean; staff:boolean; media:ReactNode}) {
  const initialized = useRef(false);
  const root = useRef<HTMLDivElement>(null);
  const [inquiryHost, setInquiryHost] = useState<Element | null>(null);
  const [mediaHost, setMediaHost] = useState<Element | null>(null);
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const container = root.current;
    if (!container) return;
    container.querySelectorAll("[data-account-link]").forEach((link) => {
      if (signedIn) {
        link.textContent = staff ? "Staff workspace" : "Your account";
        link.setAttribute("href", staff ? "/admin" : "/account");
      }
    });
    setInquiryHost(container.querySelector("[data-inquiry-slot]"));
    setMediaHost(container.querySelector("[data-media-slot]"));
    const script = document.createElement("script");
    script.type = "module";
    script.src = `/theme/interactions.js?mount=${Date.now()}`;
    container.append(script);
  }, [signedIn, staff]);
  return <>
    <link rel="stylesheet" href="/theme/scoped.css" />
    <div className="layernote-theme" ref={root} dangerouslySetInnerHTML={{__html:html}} />
    {inquiryHost && createPortal(<PublicInquiry source="homepage" compact />, inquiryHost)}
    {mediaHost && media && createPortal(media, mediaHost)}
  </>;
}
