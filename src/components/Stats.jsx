import React from 'react';

const cards = [
  {
    containerClass: 'framer-16ed1ld-container',
    title: '5 Hackathon Wins',
    desc: 'Consistent top performer under pressure across intense 24–48 hr hackathons.',
  },
  {
    containerClass: 'framer-140mk5d-container',
    title: '20+ Participations',
    desc: 'I show up, compete, and finish every time — never quit, always learning.',
  },
  {
    containerClass: 'framer-19ysbx8-container',
    title: '0 Quits',
    desc: 'I commit completely to execution. Failure is the data I iterate from.',
  },
];

const XIcon = () => (
  <div
    style={{
      width: 44,
      height: 44,
      borderRadius: '50%',
      backgroundColor: 'var(--token-10bc40bb-604b-41d4-b321-4b409afa6a9f, rgb(255, 219, 88))',
      border: '2px solid var(--token-14825bd6-f9b4-4846-afef-1af0cbf8c065, rgb(0, 0, 0))',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      margin: '0 auto',
    }}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width="24"
      height="24"
      style={{ fill: 'rgb(220, 38, 38)', flexShrink: 0 }}
    >
      <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
    </svg>
  </div>
);

export const Stats = () => {
  return (
    <section className="framer-ljowmk" data-framer-name="problem" id="problem">
      {/* Background texture */}
      <div className="framer-gfqefc-container">
        <div
          className="framer-56Ysx framer-fbiaj5 framer-v-fbiaj5"
          data-framer-name="Default"
          style={{ height: '100%', width: '100%', opacity: 0.5 }}
        >
          <div
            style={{
              position: 'absolute',
              borderRadius: 'inherit',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              backgroundImage: 'url(assets/images/default-27.svg)',
              backgroundRepeat: 'repeat',
              backgroundPosition: 'center',
              border: 0,
              backgroundSize: '187.5px auto',
            }}
            data-framer-background-image-wrapper="true"
          />
        </div>
      </div>

      <div className="framer-16wtjqq" data-framer-name="content">
        {/* Section header */}
        <div className="framer-16g2mbu" data-framer-name="wrapper">
          {/* Badge */}
          <div className="framer-riv6i2-container">
            <div
              className="framer-QpGIS framer-jVdE7 framer-1lyq2hd framer-v-1lyq2hd"
              data-border="true"
              data-framer-name="Default"
              style={{
                '--border-bottom-width': '2px',
                '--border-color': 'var(--token-14825bd6-f9b4-4846-afef-1af0cbf8c065, rgb(0, 0, 0))',
                '--border-left-width': '2px',
                '--border-right-width': '2px',
                '--border-style': 'solid',
                '--border-top-width': '2px',
                backgroundColor: 'var(--token-fdcc5b21-a997-46c1-a990-9f9c0159a383, rgb(248, 214, 179))',
                boxShadow: '4px 4px 0px 0px var(--token-14825bd6-f9b4-4846-afef-1af0cbf8c065, rgb(0, 0, 0))',
                opacity: 1,
              }}
            >
              <div
                className="framer-ktx7xz"
                style={{
                  outline: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  flexShrink: 0,
                  '--framer-link-text-color': 'rgb(0, 153, 255)',
                  '--framer-link-text-decoration': 'underline',
                  transform: 'none',
                  opacity: 1,
                }}
                data-framer-component-type="RichTextContainer"
              >
                <p className="framer-text framer-styles-preset-k0zyfh" data-styles-preset="rhkDaosjl">
                  Stats
                </p>
              </div>
            </div>
          </div>

          {/* Title + Description */}
          <div className="framer-11w0q0b" data-framer-name="wrapper">
            <div
              className="framer-j9s6kl"
              style={{ outline: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', flexShrink: 0, transform: 'none' }}
              data-framer-component-type="RichTextContainer"
            >
              <h2 className="framer-text framer-styles-preset-1414slq" data-styles-preset="iJ0GIKQvm">
                Proven track record of shipping
              </h2>
            </div>
            <div
              className="framer-1apil0h"
              style={{ outline: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', flexShrink: 0, transform: 'none' }}
              data-framer-component-type="RichTextContainer"
            >
              <p className="framer-text framer-styles-preset-1wx5uu0" data-styles-preset="yWUJk0B4D">
                5 hackathon wins, 20+ participations, and 0 quits — built under pressure, shipped with purpose.
              </p>
            </div>
          </div>
        </div>

        {/* 3-column cards */}
        <div className="framer-i49pa6" data-framer-name="wrapper">
          {cards.map(({ containerClass, title, desc }) => (
            <div key={title} className={containerClass}>
              <div
                className="framer-X6dYR framer-aw2sJ framer-CraGg framer-1f6l56w framer-v-1h7jz2a"
                data-border="true"
                data-framer-name="problem-card"
                style={{
                  '--border-bottom-width': '2px',
                  '--border-color': 'var(--token-14825bd6-f9b4-4846-afef-1af0cbf8c065, rgb(0, 0, 0))',
                  '--border-left-width': '2px',
                  '--border-right-width': '2px',
                  '--border-style': 'solid',
                  '--border-top-width': '2px',
                  backgroundColor: 'var(--token-735d697b-5a03-49fe-9b66-80e6a14713f9, rgb(255, 255, 255))',
                  boxShadow: '8px 8px 0px 0px var(--token-14825bd6-f9b4-4846-afef-1af0cbf8c065, rgb(0, 0, 0))',
                  height: '100%',
                  width: '100%',
                  opacity: 1,
                }}
              >
                <div className="framer-9vsty4" data-framer-name="wrapper" style={{ opacity: 1 }}>
                  <div className="framer-39127p" data-framer-name="wrapper" style={{ opacity: 1 }}>
                    <div
                      className="framer-o0077q"
                      style={{
                        outline: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        flexShrink: 0,
                        '--framer-link-text-color': 'rgb(0, 153, 255)',
                        '--framer-link-text-decoration': 'underline',
                        transform: 'none',
                        opacity: 1,
                      }}
                      data-framer-component-type="RichTextContainer"
                    >
                      <h3
                        className="framer-text framer-styles-preset-1w6sc1n"
                        data-styles-preset="WCABqTCb2"
                        style={{ '--framer-text-alignment': 'center' }}
                      >
                        {title}
                      </h3>
                    </div>
                    <div
                      className="framer-utlwrm"
                      style={{
                        outline: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        flexShrink: 0,
                        '--framer-link-text-color': 'rgb(0, 153, 255)',
                        '--framer-link-text-decoration': 'underline',
                        transform: 'none',
                        opacity: 1,
                      }}
                      data-framer-component-type="RichTextContainer"
                    >
                      <p
                        className="framer-text framer-styles-preset-1wx5uu0"
                        data-styles-preset="yWUJk0B4D"
                        style={{ '--framer-text-alignment': 'center' }}
                      >
                        {desc}
                      </p>
                    </div>
                  </div>

                  {/* X Icon */}
                  <div
                    className="framer-1wialgw"
                    aria-hidden="true"
                    style={{
                      imageRendering: 'pixelated',
                      flexShrink: 0,
                      opacity: 1,
                    }}
                  >
                    <XIcon />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
