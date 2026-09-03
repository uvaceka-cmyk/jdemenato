"use client";
import { FormEvent, useEffect, useState } from "react";

type Consent = "all" | "necessary";

export function GlobalControls() {
  const [cookie, setCookie] = useState<"open" | "settings" | "closed">("closed");
  const [analytics, setAnalytics] = useState(false);
  const [feedback, setFeedback] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("jdemnato-consent") as Consent | null;
    if (!saved) setCookie("open");
    setAnalytics(saved === "all");
    const openSettings = () => setCookie("settings");
    window.addEventListener("jdemnato-cookie-settings", openSettings);
    return () => window.removeEventListener("jdemnato-cookie-settings", openSettings);
  }, []);

  const saveConsent = (value: Consent) => {
    localStorage.setItem("jdemnato-consent", value);
    setAnalytics(value === "all");
    window.dispatchEvent(new CustomEvent("jdemnato-consent", { detail: value }));
    setCookie("closed");
  };

  async function submitFeedback(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const response = await fetch("/api/feedback", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...data, page: location.pathname }) });
    if (response.ok) setSent(true);
  }

  return <>
    <button className="feedback-launcher" onClick={() => { setFeedback(true); setSent(false); }}>Ohodnotit Zakly</button>
    {feedback && <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Hodnocení portálu"><form className="feedback-card" onSubmit={submitFeedback}><button type="button" className="modal-close" aria-label="Zavřít" onClick={() => setFeedback(false)}>×</button>{sent ? <><h2>Děkujeme!</h2><p>Vaše hodnocení nám pomůže web zlepšit.</p><button type="button" className="primary" onClick={() => setFeedback(false)}>Zavřít</button></> : <><p className="eyebrow">VÁŠ NÁZOR</p><h2>Jak se vám web používá?</h2><fieldset><legend>Hodnocení</legend><div className="rating-options">{[1,2,3,4,5].map(n => <label key={n}><input required type="radio" name="rating" value={n}/><span>{n} ★</span></label>)}</div></fieldset><label>Co máme zlepšit?<textarea name="message" maxLength={1200}/></label><label className="honeypot" aria-hidden="true">Web<input name="website" tabIndex={-1} autoComplete="off"/></label><button className="primary">Odeslat hodnocení</button></>}</form></div>}
    {cookie !== "closed" && <div className="cookie" role="dialog" aria-modal="true" aria-label="Nastavení cookies"><div className="cookie-icon">◉</div><div><h3>Vaše soukromí na Zakly</h3><p>Nezbytné technologie používáme pro fungování webu. Volitelné měření spustíme pouze s vaším souhlasem.</p>{cookie === "settings" && <div className="cookie-settings"><label><input type="checkbox" checked disabled/> Nezbytné <span>vždy aktivní</span></label><label><input type="checkbox" checked={analytics} onChange={e => setAnalytics(e.target.checked)}/> Analytické <span>volitelné</span></label></div>}</div><div className="cookie-actions"><button className="primary" onClick={() => saveConsent("all")}>Přijmout vše</button><button onClick={() => saveConsent("necessary")}>Odmítnout volitelné</button>{cookie === "open" ? <button className="link-btn" onClick={() => setCookie("settings")}>Nastavení</button> : <button className="link-btn" onClick={() => saveConsent(analytics ? "all" : "necessary")}>Uložit nastavení</button>}</div></div>}
  </>;
}
