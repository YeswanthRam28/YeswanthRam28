import React from 'react';

const richTextStyle = {
  outline: 'none',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  flexShrink: 0,
  '--framer-link-text-color': 'rgb(0, 153, 255)',
  '--framer-link-text-decoration': 'underline',
  transform: 'none',
  opacity: 1,
};

const borderBase = {
  '--border-bottom-width': '2px',
  '--border-color': 'var(--token-14825bd6-f9b4-4846-afef-1af0cbf8c065, rgb(0, 0, 0))',
  '--border-left-width': '2px',
  '--border-right-width': '2px',
  '--border-style': 'solid',
  '--border-top-width': '2px',
  boxShadow: '8px 8px 0px 0px var(--token-14825bd6-f9b4-4846-afef-1af0cbf8c065, rgb(0, 0, 0))',
  opacity: 1,
};

export const Skills = () => {
  return (
    <section className="framer-4fwxaw" data-framer-name="benefits" id="benefits">
      {/* Background texture */}
      <div className="framer-m5w5gj-container">
        <div className="framer-56Ysx framer-fbiaj5 framer-v-fbiaj5" style={{ height: '100%', width: '100%', opacity: 0.5 }}>
          <div
            style={{ position: 'absolute', borderRadius: 'inherit', top: 0, right: 0, bottom: 0, left: 0, backgroundImage: 'url(assets/images/default-27.svg)', backgroundRepeat: 'repeat', backgroundPosition: 'center', border: 0, backgroundSize: '187.5px auto' }}
            data-framer-background-image-wrapper="true"
          />
        </div>
      </div>

      <div className="framer-o7cb88" data-framer-name="content">
        {/* Section header */}
        <div className="framer-yw6p1f" data-framer-name="wrapper">
          {/* Badge */}
          <div className="framer-1sb4gyw-container">
            <div
              className="framer-QpGIS framer-jVdE7 framer-1lyq2hd framer-v-1lyq2hd"
              data-border="true"
              style={{ '--border-bottom-width': '2px', '--border-color': 'var(--token-14825bd6-f9b4-4846-afef-1af0cbf8c065, rgb(0, 0, 0))', '--border-left-width': '2px', '--border-right-width': '2px', '--border-style': 'solid', '--border-top-width': '2px', backgroundColor: 'var(--token-fdcc5b21-a997-46c1-a990-9f9c0159a383, rgb(248, 214, 179))', boxShadow: '4px 4px 0px 0px var(--token-14825bd6-f9b4-4846-afef-1af0cbf8c065, rgb(0, 0, 0))', opacity: 1 }}
            >
              <div className="framer-ktx7xz" style={richTextStyle}>
                <p className="framer-text framer-styles-preset-k0zyfh" data-styles-preset="rhkDaosjl">Skills</p>
              </div>
            </div>
          </div>

          {/* Title + Description */}
          <div className="framer-144zozj" data-framer-name="wrapper">
            <div className="framer-1s21ymi" style={{ outline: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', flexShrink: 0, transform: 'none' }}>
              <h2 className="framer-text framer-styles-preset-1414slq" data-styles-preset="iJ0GIKQvm">Technical Stack Strategy</h2>
            </div>
            <div className="framer-rladdc" style={{ outline: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', flexShrink: 0, transform: 'none' }}>
              <p className="framer-text framer-styles-preset-1wx5uu0" data-styles-preset="yWUJk0B4D">
                A layered approach to building autonomous and intelligent systems.
              </p>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="framer-aj0wc3" data-framer-name="wrapper">

          {/* Row 1: Intelligence Layer (double) + Perception Layer (single) */}
          <div className="framer-glzgl6" data-framer-name="wrapper">
            <div className="framer-wc2nip-container">
              <div className="framer-X6dYR framer-aw2sJ framer-CraGg framer-1f6l56w framer-v-1uq5497" data-border="true" data-framer-name="Double"
                style={{ ...borderBase, backgroundColor: 'var(--token-df3b0292-9153-4484-b1d6-f7e71cc31198, rgb(253, 253, 150))', height: '100%', width: '100%' }}>
                <div className="framer-9vsty4" style={{ opacity: 1 }}>
                  <div className="framer-39127p" style={{ opacity: 1 }}>
                    <div className="framer-o0077q" style={richTextStyle}>
                      <h3 className="framer-text framer-styles-preset-1w6sc1n" style={{ '--framer-text-alignment': 'left' }}>Intelligence Layer</h3>
                    </div>
                    <div className="framer-utlwrm" style={{ ...richTextStyle, '--extracted-r6o4lv': 'var(--token-14825bd6-f9b4-4846-afef-1af0cbf8c065, rgb(0, 0, 0))' }}>
                      <p className="framer-text framer-styles-preset-1wx5uu0" style={{ '--framer-text-alignment': 'left', '--framer-text-color': 'var(--extracted-r6o4lv, rgb(0,0,0))' }}>
                        ML / LLM Orchestration / RAG Pipelines / Agentic Systems — the brain behind every product I build.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="framer-1hmbuwv-container">
              <div className="framer-X6dYR framer-aw2sJ framer-CraGg framer-1f6l56w framer-v-1f6l56w" data-border="true" data-framer-name="Single"
                style={{ ...borderBase, backgroundColor: 'var(--token-735d697b-5a03-49fe-9b66-80e6a14713f9, rgb(255, 255, 255))', width: '100%' }}>
                <div className="framer-9vsty4" style={{ opacity: 1 }}>
                  <div className="framer-39127p" style={{ opacity: 1 }}>
                    <div className="framer-o0077q" style={richTextStyle}>
                      <h3 className="framer-text framer-styles-preset-1w6sc1n" style={{ '--framer-text-alignment': 'left' }}>Perception Layer</h3>
                    </div>
                    <div className="framer-utlwrm" style={richTextStyle}>
                      <p className="framer-text framer-styles-preset-1wx5uu0" style={{ '--framer-text-alignment': 'left' }}>
                        Computer Vision (OpenCV) / MediaPipe (Face & Pose) / Real-Time Inference.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Rapid Prototyping (single) + Engineering Layer (double) */}
          <div className="framer-5bbhxl" data-framer-name="wrapper">
            <div className="framer-8gkxpc-container">
              <div className="framer-X6dYR framer-aw2sJ framer-CraGg framer-1f6l56w framer-v-1f6l56w" data-border="true" data-framer-name="Single"
                style={{ ...borderBase, backgroundColor: 'var(--token-735d697b-5a03-49fe-9b66-80e6a14713f9, rgb(255, 255, 255))', width: '100%' }}>
                <div className="framer-9vsty4" style={{ opacity: 1 }}>
                  <div className="framer-39127p" style={{ opacity: 1 }}>
                    <div className="framer-o0077q" style={richTextStyle}>
                      <h3 className="framer-text framer-styles-preset-1w6sc1n" style={{ '--framer-text-alignment': 'left' }}>Rapid Prototyping</h3>
                    </div>
                    <div className="framer-utlwrm" style={richTextStyle}>
                      <p className="framer-text framer-styles-preset-1wx5uu0" style={{ '--framer-text-alignment': 'left' }}>
                        Ship fast, break it, rebuild sharper — from concept to demo in hours.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="framer-1ipu3qq-container">
              <div className="framer-X6dYR framer-aw2sJ framer-CraGg framer-1f6l56w framer-v-1uq5497" data-border="true" data-framer-name="Double"
                style={{ ...borderBase, backgroundColor: 'var(--token-353de080-56da-4189-9321-c69d0ed1b3ed, rgb(218, 245, 240))', height: '100%', width: '100%' }}>
                <div className="framer-9vsty4" style={{ opacity: 1 }}>
                  <div className="framer-39127p" style={{ opacity: 1 }}>
                    <div className="framer-o0077q" style={richTextStyle}>
                      <h3 className="framer-text framer-styles-preset-1w6sc1n" style={{ '--framer-text-alignment': 'left' }}>Engineering Layer</h3>
                    </div>
                    <div className="framer-utlwrm" style={{ ...richTextStyle, '--extracted-r6o4lv': 'var(--token-14825bd6-f9b4-4846-afef-1af0cbf8c065, rgb(0, 0, 0))' }}>
                      <p className="framer-text framer-styles-preset-1wx5uu0" style={{ '--framer-text-alignment': 'left', '--framer-text-color': 'var(--extracted-r6o4lv, rgb(0,0,0))' }}>
                        FastAPI + React / Docker & Linux / PostgreSQL & Neon DB — the stack that holds it all together.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: Languages & Tools (double) + Problem Solving (single) */}
          <div className="framer-1c1a07a" data-framer-name="wrapper">
            <div className="framer-ajuz85-container">
              <div className="framer-X6dYR framer-aw2sJ framer-CraGg framer-1f6l56w framer-v-1uq5497" data-border="true" data-framer-name="Double"
                style={{ ...borderBase, backgroundColor: 'var(--token-fdcc5b21-a997-46c1-a990-9f9c0159a383, rgb(248, 214, 179))', height: '100%', width: '100%' }}>
                <div className="framer-9vsty4" style={{ opacity: 1 }}>
                  <div className="framer-39127p" style={{ opacity: 1 }}>
                    <div className="framer-o0077q" style={richTextStyle}>
                      <h3 className="framer-text framer-styles-preset-1w6sc1n" style={{ '--framer-text-alignment': 'left' }}>Languages & Tools</h3>
                    </div>
                    <div className="framer-utlwrm" style={{ ...richTextStyle, '--extracted-r6o4lv': 'var(--token-14825bd6-f9b4-4846-afef-1af0cbf8c065, rgb(0, 0, 0))' }}>
                      <p className="framer-text framer-styles-preset-1wx5uu0" style={{ '--framer-text-alignment': 'left', '--framer-text-color': 'var(--extracted-r6o4lv, rgb(0,0,0))' }}>
                        Python / JavaScript / TypeScript / Git / Jupyter / HuggingFace — the palette I paint with.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="framer-47cv4b-container">
              <div className="framer-X6dYR framer-aw2sJ framer-CraGg framer-1f6l56w framer-v-1f6l56w" data-border="true" data-framer-name="Single"
                style={{ ...borderBase, backgroundColor: 'var(--token-735d697b-5a03-49fe-9b66-80e6a14713f9, rgb(255, 255, 255))', width: '100%' }}>
                <div className="framer-9vsty4" style={{ opacity: 1 }}>
                  <div className="framer-39127p" style={{ opacity: 1 }}>
                    <div className="framer-o0077q" style={richTextStyle}>
                      <h3 className="framer-text framer-styles-preset-1w6sc1n" style={{ '--framer-text-alignment': 'left' }}>Problem Solving</h3>
                    </div>
                    <div className="framer-utlwrm" style={richTextStyle}>
                      <p className="framer-text framer-styles-preset-1wx5uu0" style={{ '--framer-text-alignment': 'left' }}>
                        I break problems down to first principles and build back up with clarity and speed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
