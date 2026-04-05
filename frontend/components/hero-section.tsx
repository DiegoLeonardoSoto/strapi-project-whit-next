import { STRAPI_BASE_URL } from "@/lib/strapi";
import Image from "next/image";
import Link from "next/link";

const styles = {
  header: "relative h-[600px] overflow-hidden",
  backgroundImage: "absolute inset-0 object-cover w-full h-full",
  overlay:
    "relative z-10 flex flex-col items-center justify-center h-full text-center text-white bg-black/50",
  heading: "text-4xl font-bold md:text-5xl lg:text-6xl",
  subheading: "mt-4 text-lg md:text-xl lg:text-2xl",
  button:
    "mt-8 inline-flex items-center justify-center px-6 py-3 text-base font-medium text-black bg-white rounded-md shadow hover:bg-gray-100 transition-colors",
};

export function HeroSection({
  data,
}: {
  readonly data: {
    heading: string;
    subHeading: string;
    link: { href: string; label: string };
    heroImage: [{ url: string; alternativeText: string }];
  };
}) {
  if (!data) return null;
  console.log(data);

  const { heading, subHeading, link } = data;

  const imageUrl = data.heroImage[0]?.url.startsWith("http")
    ? data.heroImage[0].url
    : `${STRAPI_BASE_URL}${data.heroImage[0]?.url}`;

  console.log(imageUrl);

  return (
    <header className={styles.header}>
      <Image
        alt="Background"
        className={styles.backgroundImage}
        height={1000}
        src={imageUrl}
        style={{
          aspectRatio: "1920/1080",
          objectFit: "cover",
        }}
        width={1920}
      />
      <div className={styles.overlay}>
        <h1 className={styles.heading}>{heading}</h1>
        <p className={styles.subheading}>{subHeading}</p>
        <Link className={styles.button} href={link.href}>
          {link.label}
        </Link>
      </div>
    </header>
  );
}
