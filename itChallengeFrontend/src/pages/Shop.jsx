import React, { useMemo, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./Shop.css";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import Slider from "../components/slider/Slider";
import SelectButton from "../components/selection/Selectbutton";
import Product from "../components/product/Product";
import api from "../utils/api";
import { MERCH_IDS } from "../data/merchMeta";
import { scrollWithSliderOffset } from "../utils/scrollWithSliderOffset";


function useHashScroll() {
  const location = useLocation();
  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    const t = setTimeout(() => {
      scrollWithSliderOffset(id).catch(() => {});
    }, 60);
    return () => clearTimeout(t);
  }, [location]);
}

// Products are fetched from backend. We'll show a simple filter toggle placeholder.

export default function Shop() {
  const [segment, setSegment] = useState("domov");
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const SMARTIE_SHORT = "Inteligentný asistent bývania, ktorý spája senzory a automatizácie pre zdravý, bezpečný a úsporný domov.";
  const SMARTIE_LONG = (
    <>
      <p>
        HoloHome’s Smartie je AI asistent pre byty a domy, ktorý dohliada na komfort a bezpečie: sleduje teplotu, vlhkosť a kvalitu vzduchu, stráži dym aj únik vody a vie reagovať na pohyb či otvorenie dverí. Všetko vidíš v prehľadnej aplikácii a môžeš nastavovať automatizácie (napr. upozornenia, scénáre úspor). Smartie prináša filozofiu „where innovation meets home“ priamo do tvojho interiéru – jednoducho, spoľahlivo a udržateľne.
      </p>
      <h3>Vlastnosti</h3>
      <ul>
        <li>Monitoring prostredia: teplota, vlhkosť, kvalita vzduchu (VOC/PM*) a intenzita svetla.</li>
        <li>Bezpečnostné senzory: pohyb, dym, únik vody, otvorenie dverí/okien.</li>
        <li>Automatizácie a notifikácie: scénáre pre komfort, bezpečnosť a úspory.</li>
        <li>Integrácia so Smart Home (gateway IP→Zigbee/Matter podľa návrhu riešenia).</li>
      </ul>
      <h3>Špecifikácie (príkladové komponenty)</h3>
      <ul>
        <li>Wi‑Fi domácnosti + repeater (počet ks podľa výberu)</li>
        <li>IP↔Zigbee/Matter gateway (1 ks)</li>
        <li>Kamera interiérová (ks podľa výberu)</li>
        <li>Senzory: únik vody, dym, pohyb, otvorenie dverí (ks podľa potreby)</li>
      </ul>
    </>
  );
  
  const ENTERPRISE_SHORT = "Virtuálny domovník pre bytové domy: riadené vstupy, monitoring, odpočty spotrieb a správa budovy v jednej platforme.";
  const ENTERPRISE_LONG = (
    <>
      <p>
        HoloHome’s Enterprise je komplexný AI „virtuálny domovník“ pre bytové domy. Zabezpečuje hlavný aj vedľajšie vstupy, monitoruje pohyb v interiéri/exteriéri, zberá odpočty vody a tepla a sleduje kvalitu ovzdušia v spoločných priestoroch. Správcom prináša prehľad o zariadeniach a incidentoch, obyvateľom zvyšuje bezpečnosť a komfort a vďaka digitalizácii procesov znižuje prevádzkové náklady. S jednotnou identitou HoloHome pôsobí moderne, dôveryhodne a konzistentne naprieč všetkými materiálmi.
      </p>
      <h3>Vlastnosti</h3>
      <ul>
        <li>Riadené vstupy: videovrátnik (hlavný vchod) + kontrolované dvere (vedľajšie vstupy, pivnice, technické miestnosti).</li>
        <li>CCTV: interiérové kamery (pohyb osôb) a exteriérové kamery (vozidlá a perimetr).</li>
        <li>Energetické odpočty: voda, teplo (kalorimeter).</li>
        <li>Enviro monitoring: teplota, vlhkosť, kvalita ovzdušia v spoločných priestoroch.</li>
        <li>Notifikácie a reporty pre správu bytovky.</li>
      </ul>
      <h3>Špecifikácie (príkladové komponenty)</h3>
      <ul>
        <li>Videovrátnik pre hlavný vchod (ks) + kontrolované vstupy pre vedľajšie dvere (ks)</li>
        <li>Kamery: interiér (ks), exteriér (ks)</li>
        <li>Diaľkové odpočty: voda (ks), teplo – kalorimeter (ks)</li>
        <li>Senzory prostredia (teplota, vlhkosť, PM) (ks)</li>
      </ul>
    </>
  );
  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await api.get('/products');
        const products = Array.isArray(data?.products) ? data.products : [];
        // Adapt server shape -> frontend
        const adapted = products.map((p) => {
          const base = {
            id: p.id,
            name: p.name,
            shortDesc: p.description?.slice(0, 80) || '',
            longDesc: p.description || '',
            price: Number(p.cost || 0),
            image: `/assets/images/product-${p.id}.jpg`,
            segment: p.id === 'smartie' ? 'domov' : p.id === 'enterprise' ? 'bytovka' : 'other',
          };
          if (p.id === 'smartie') {
            return { ...base, shortDesc: SMARTIE_SHORT, longDesc: SMARTIE_LONG };
          }
          if (p.id === 'enterprise') {
            return { ...base, shortDesc: ENTERPRISE_SHORT, longDesc: ENTERPRISE_LONG };
          }
          return base;
        });
  // Keep only Smartie & Enterprise and exclude merch completely
        const filtered = adapted.filter((p) => (p.id === 'smartie' || p.id === 'enterprise') && !MERCH_IDS.has(p.id));
        if (!ignore) setAllProducts(filtered);
      } catch (e) {
        if (!ignore) setError(e.message || 'Nepodarilo sa načítať produkty');
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, []);
  useHashScroll();
  const items = useMemo(
    () => allProducts.filter((p) => p.segment === segment),
    [segment, allProducts]
  );
  return (
    <>
      <Navbar />
      <main className="shop">
        <section className="home-hero full-screen">
          <Slider
            showControls={false}
            slides={[
              {
                id: "shop-1",
                image: '../src/assets/images/slidershop.webp',
                title: "Všetko pre inteligentné a pohodlné bývanie.",
                subtitle: "Objav smart riešenia, ktoré prepoja technológie s tvojím domovom. HoloHome zariadenia robia z každého bytu miesto, kde technológia pracuje pre teba.",
                actions: [],
              },
            ]}
          />
        </section>
        <div id="products" className="shop-select container">
          <SelectButton
            defaultValue="domov"
            onChange={(val) => setSegment(val)}
          />
        </div>

  <section className="shop-grid container">
          {loading && <div style={{padding:16}}>Načítavam produkty…</div>}
          {error && <div style={{padding:16, color:'var(--danger, #b91c1c)'}}>{error}</div>}
          {!loading && !error && items.map((p) => (
            <div key={p.id} className="product-row">
              <Product
                id={p.id}
                name={p.name}
                shortDesc={p.shortDesc}
                longDesc={p.longDesc}
                price={p.price}
                image={p.image}
              />
            </div>
          ))}
        </section>

        <section className="shop-help container">
          <div className="shop-help-media">
            <img
              src="../src/assets/images/likes.png"
              alt="Helping homes illustration"
              loading="lazy"
            />
          </div>
          <div className="shop-help-copy">
            <h2>„Spokojní zákazníci, inteligentné domovy.“</h2>
            <p>Viac než 9 z 10 zákazníkov odporúča produkty HoloHome ďalej.</p>
            <p>
              Naše riešenia prinášajú istotu, komfort a moderný spôsob správy
              bývania – od virtuálneho domovníka až po inteligentné senzory pre váš byt.
            </p>
            <p>Každá objednávka je krokom k efektívnejšiemu a bezpečnejšiemu domovu.</p>
          </div>
        </section>

        <p className="shop-help-slogan container">„Technológia, ktorá sa prispôsobí vášmu životu.“</p>
      </main>

      <Footer />
    </>
  );
}

