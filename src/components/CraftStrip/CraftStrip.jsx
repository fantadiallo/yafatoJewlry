import styles from "./CraftStrip.module.scss";
import { Hammer, Gem, ShieldCheck } from "lucide-react";

export default function CraftStrip() {
  const items = [
    {
      icon: Hammer,
      title: "Handmade",
      text: "Made slowly by skilled hands no mass production.",
    },
    {
      icon: Gem,
      title: "925 Sterling Silver",
      text: "Crafted in quality silver with a clean, lasting finish.",
    },
    {
      icon: ShieldCheck,
      title: "Made to last",
      text: "Designed for everyday wear  polished, strong, timeless.",
    },
  ];

  return (
    <section className={styles.craft} aria-label="Craft and materials">
      <div className={styles.inner}>
        <div className={styles.head}>
          <p className={styles.kicker}>Craft</p>
          <h2 className={styles.title}>Quality you can feel</h2>
        </div>

        <div className={styles.grid}>
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className={styles.card}>
                <div className={styles.iconWrap} aria-hidden="true">
                  <Icon size={20} strokeWidth={1.6} />
                </div>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardText}>{item.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
