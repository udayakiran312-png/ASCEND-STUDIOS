
import {
  Truck,
  Package,
  BadgeCheck,
  LockKeyhole,
} from "lucide-react";

import "./StoreBenefits.css";

const benefits = [
  {
    icon: Truck,
    title: "FAST DELIVERY",
    description: "Quick & safe delivery",
  },
  {
    icon: Package,
    title: "EASY RETURNS",
    description: "Within 15 days",
  },
  {
    icon: BadgeCheck,
    title: "QUALITY ASSURED",
    description: "Best fashion, best quality",
  },
  {
    icon: LockKeyhole,
    title: "SECURE PAYMENT",
    description: "100% secure checkout",
  },
];

export default function StoreBenefits() {
  return (
    <section className="store-benefits">
      {benefits.map((benefit) => {
        const Icon = benefit.icon;

        return (
          <div className="store-benefit" key={benefit.title}>
            <Icon size={30} strokeWidth={1.5} />

            <div className="store-benefit-text">
              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </div>
          </div>
        );
      })}
    </section>
  );
}
