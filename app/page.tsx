import { Mail } from 'lucide-react';
import { LoginLink } from 'components/LoginLink';
import { GetStartedButton } from './_components/GetStartedButton';

const features = [
  {
    num: '01',
    title: 'GATHER YOUR FRIENDS',
    body: 'Invite your crew to a private prediction league.'
  },
  {
    num: '02',
    title: 'PREDICT THE WINNERS',
    body: 'Submit your picks for every category before the ceremony.'
  },
  {
    num: '03',
    title: 'SEE RESULTS LIVE',
    body: 'Watch the leaderboard update in real time as winners are announced.'
  }
];

export default function Page() {
  return (
    <main className="flex flex-col lg:flex-row min-h-screen bg-[#0D0D0D]">
      {/* Left panel – cinema image */}
      <div
        className="relative flex flex-col justify-between h-[360px] lg:h-screen lg:w-[40%] overflow-hidden shrink-0"
        style={{
          backgroundImage: "url('/images/cinema.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-[#0D0D0D33] to-[#0D0D0DED]" />

        {/* Login – top right */}
        <div className="relative z-10 flex justify-end p-6 lg:p-8">
          <LoginLink
            className="leading-none transition-opacity duration-300 ease-in"
            linkClassName="font-bebas-neue text-[13px] tracking-[0.15em] text-white/75 no-underline"
          />
        </div>

        {/* Branding – bottom */}
        <div className="relative z-10 p-8 lg:p-16">
          <div className="w-12 h-0.5 bg-gold mb-4" />
          <h1 className="font-bebas-neue text-[52px] lg:text-[72px] leading-[0.9] tracking-tight text-white">
            AWARDS
            <br />
            NIGHT
          </h1>
          <p className="font-cormorant-garamond italic text-white/50 text-base mt-3">
            Social prediction for the Academy Awards
          </p>
        </div>
      </div>

      {/* Thin vertical divider – desktop only */}
      <div className="hidden lg:block w-px bg-gold/25 shrink-0" />

      {/* Right panel – content */}
      <div className="flex-1 flex flex-col justify-center bg-[#141414] px-7 lg:px-[72px] py-16 gap-6 lg:gap-9">
        <span className="font-bebas-neue text-[11px] tracking-[0.35em] text-gold uppercase">
          ACADEMY AWARDS 2026
        </span>

        <h2 className="font-bebas-neue text-[52px] lg:text-[72px] leading-[0.9] tracking-tight text-white">
          PREDICT.
          <br />
          COMPETE.
          <br />
          WATCH.
        </h2>

        <div className="h-px bg-[#2A2A2A]" />

        <ol className="flex flex-col gap-4 lg:gap-5 list-none p-0 m-0">
          {features.map(({ num, title, body }) => (
            <li key={num} className="flex gap-4 lg:gap-5 items-start">
              <span className="font-bebas-neue text-[11px] tracking-[0.35em] text-gold pt-0.5 shrink-0">
                {num}
              </span>
              <div>
                <p className="font-bebas-neue text-[17px] lg:text-[18px] tracking-[0.05em] text-[#F5F4F2] m-0">
                  {title}
                </p>
                <p className="font-cormorant-garamond italic text-[14px] lg:text-[15px] text-[#8A8A8A] m-0 mt-1">
                  {body}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="flex gap-3 flex-wrap">
          <GetStartedButton />
          <a
            href="mailto:hello@awardsnight.app"
            className="font-bebas-neue text-[16px] lg:text-[17px] tracking-[0.15em] border border-gold text-gold px-8 lg:px-10 py-3.5 inline-flex items-center gap-2 no-underline"
          >
            <Mail size={15} strokeWidth={1.5} />
            LEARN MORE
          </a>
        </div>

        <p className="font-cormorant-garamond italic text-[13px] text-[#5A5A5A] m-0">
          Closed alpha —{' '}
          <a
            href="mailto:hello@awardsnight.app"
            className="text-[#5A5A5A] no-underline hover:text-gold transition-colors"
          >
            hello@awardsnight.app
          </a>
        </p>
      </div>
    </main>
  );
}
