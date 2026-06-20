import React from 'react';
import { ArrowLeft, Target, Cpu, Mic2, Code, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CaseStudy() {
  return (
    <div className="p-6 pt-12 pb-32 max-w-4xl mx-auto">
      
      {/* HEADER */}
      <Link to="/" className="inline-flex items-center text-ami-orange hover:text-white transition-colors mb-8 font-bold text-sm">
        <ArrowLeft size={16} className="mr-2" /> Back to Inventory
      </Link>

      <div className="mb-12">
        {/* ADDED pb-2 to prevent bg-clip-text from cutting off 'g' and 'p', and mb-6 for spacing */}
        <h1 className="text-5xl font-black tracking-tighter mb-6 pb-2 text-transparent bg-clip-text bg-gradient-to-r from-ami-orange to-red-500 leading-tight">
          Expanding Audio Bingo Experiences
        </h1>
        <h2 className="text-2xl font-bold text-white mb-4">Product R&D Case Study</h2>
        <p className="text-slate-400 text-lg leading-relaxed">
          An exploration into maximizing the abilities of AMI Entertainment's Music Bingo architecture by expanding into additional "Audio Game Expereinces" beyond Music bingo with Standard Numbered Bingo and Trivia Audio Bingo game formats using next-generation AI voice synthesis.
        </p>
      </div>

      {/* STATS INFOGRAPHIC (BENTO GRID) */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
        <div className="bg-slate-900 border border-white/5 rounded-2xl p-5 flex flex-col items-center justify-center text-center hover:border-ami-orange/30 transition-all shadow-lg">
          <span className="text-3xl font-black text-white mb-1">500+</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Final Audio Files</span>
        </div>
        <div className="bg-slate-900 border border-white/5 rounded-2xl p-5 flex flex-col items-center justify-center text-center hover:border-ami-orange/30 transition-all shadow-lg">
          <span className="text-3xl font-black text-white mb-1">943K</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Characters Synthesized</span>
        </div>
        <div className="bg-slate-900 border border-white/5 rounded-2xl p-5 flex flex-col items-center justify-center text-center hover:border-ami-orange/30 transition-all shadow-lg">
          <span className="text-3xl font-black text-white mb-1">5.7K</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Automated API Calls</span>
        </div>
        <div className="bg-slate-900 border border-white/5 rounded-2xl p-5 flex flex-col items-center justify-center text-center hover:border-ami-orange/30 transition-all shadow-lg">
          <span className="text-3xl font-black text-white mb-1">26</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Audio Bingo Games Created</span>
        </div>
        <div className="bg-slate-900 border border-white/5 rounded-2xl p-5 flex flex-col items-center justify-center text-center hover:border-ami-orange/30 transition-all shadow-lg">
          <span className="text-3xl font-black text-white mb-1">375</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Character Scripts Created</span>
        </div>
        <div className="bg-slate-900 border border-white/5 rounded-2xl p-5 flex flex-col items-center justify-center text-center hover:border-ami-orange/30 transition-all shadow-lg">
          <span className="text-3xl font-black text-white mb-1">12</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Custom Voice Characters</span>
        </div>
      </div>

      {/* SECTION 1: THE BUSINESS VALUE */}
      <section className="mb-12 bg-slate-900/50 border border-white/5 rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10"><Target size={120} /></div>
        <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3 relative z-10">
          <Target className="text-ami-orange" /> Maximizing Music Bingo Platform Experiences
        </h3>
        <div className="space-y-6 text-slate-300 leading-relaxed relative z-10">
          <p>
            The strategic goal was to leverage the existing software architecture of AMI's Music Bingo to host entirely new game formats without requiring ground-up engineering.
          </p>
          <div className="grid md:grid-cols-2 gap-6 mt-4">
            <div className="bg-slate-950 p-5 rounded-xl border border-white/5">
              <h4 className="text-white font-bold mb-2">Business Impact</h4>
              <p className="text-sm">Expands market reach. Venues that may not want a music-based event or differenty types of events can now host engaging Trivia Bingo nights or character-driven Bingo, maximizing the abilities and ROI of the existing system.</p>
            </div>
            <div className="bg-slate-950 p-5 rounded-xl border border-white/5">
              <h4 className="text-white font-bold mb-2">Player Experience</h4>
              <p className="text-sm">Provides highly replayable, dynamic content. Offering a variety of host personalities and Trivia topics for broad audience appeal .</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: ENGINEERING JOURNEY (TIMELINE) */}
      <section className="mb-12">
        <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
          <Cpu className="text-ami-orange" /> Taming the AI Engine
        </h3>
        
        <div className="space-y-8 pl-4 border-l-2 border-slate-800 ml-4">
          
          {/* Timeline Node 1 */}
          <div className="relative pl-6">
            <div className="absolute -left-[33px] top-1 w-4 h-4 bg-slate-900 border-2 border-slate-600 rounded-full"></div>
            <h4 className="text-xl font-bold text-white mb-2">Phase 1: The V2 Baseline & Scripting</h4>
            <p className="text-slate-400 text-sm leading-relaxed mb-3">
              Initial development utilized the ElevenLabs V2 model. The immediate challenge was writing scripts that repeated a bingo call three times without sounding repetitive. &lt;break&gt; tags were used to control the natural pacing and flow of the announcer.
            </p>
          </div>

          {/* Timeline Node 2 */}
          <div className="relative pl-6">
            <div className="absolute -left-[33px] top-1 w-4 h-4 bg-slate-900 border-2 border-slate-600 rounded-full"></div>
            <h4 className="text-xl font-bold text-white mb-2">Phase 2: The Trivia Pacing Problem</h4>
            <p className="text-slate-400 text-sm leading-relaxed mb-3">
              Trivia presented a unique challenge: players need 5+ seconds of silence to think and mark their cards between question repeats. Because standard AI TTS systems trim trailing silence, we engineered a custom Python/FFmpeg pipeline to parse scripts, identify break tags, and mathematically inject exact moments of absolute silence into the final MP3s.
            </p>
          </div>

          {/* Timeline Node 3 */}
          <div className="relative pl-6">
            <div className="absolute -left-[33px] top-1 w-4 h-4 bg-slate-900 border-2 border-ami-orange shadow-[0_0_15px_rgba(249,115,22,0.5)] rounded-full"></div>
            <h4 className="text-xl font-bold text-ami-orange mb-2">Phase 3: Conquering the V3 Model</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              The upgrade to ElevenLabs V3 offered vastly superior emotional inflection, but deprecated the &lt;break&gt; tag architecture we relied on. 
              <br/><br/>
              <strong>The Solution:</strong> We devised a system to inject custom text markers into the scripts. Our automation pipeline split the script at these markers, generated the audio in discrete chunks, and concatenated them back together seamlessly. This required meticulous handling of punctuation across splices to maintain the natural conversational flow of the V3 engine.
            </p>
          </div>

        </div>
      </section>

      {/* SECTION 3: CREATIVE PIPELINE */}
      <section className="mb-12 bg-slate-900/50 border border-white/5 rounded-3xl p-8">
        <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
          <Mic2 className="text-ami-orange" /> Voice Design & Content Strategy
        </h3>
        <p className="text-slate-300 leading-relaxed mb-6">
          Technology is only as engaging as its content. Significant effort was invested in prompt engineering and creative writing to ensure the AI delivered performances, not just speech.
        </p>
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <Zap className="text-ami-orange shrink-0 mt-1" size={18} />
            <span className="text-slate-300 text-sm"><strong>"In the style of":</strong> Scripts were meticulously written to force the AI into character—from capturing the cadence of a Southern host to mimicking the exact vocal fry and inflection of the <em>Sex and the City</em> narrator.</span>
          </li>
          <li className="flex items-start gap-3">
            <Zap className="text-ami-orange shrink-0 mt-1" size={18} />
            <span className="text-slate-300 text-sm"><strong>Asset Reusability:</strong> Repurposed successful models from the AMI Voice prototypes while synthesizing brand new custom voices tailored specifically to the Trivia and Bingo demographics to ensure maximum question variety.</span>
          </li>
        </ul>
      </section>
	  
	  {/* SECTION 4: PROOF OF CONCEPT & SCALABILITY */}
      <section className="mb-12 bg-slate-900 border border-ami-orange/30 rounded-3xl p-8 relative overflow-hidden shadow-[0_0_40px_rgba(249,115,22,0.05)]">
        {/* Subtle background glow effect */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-ami-orange/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3 relative z-10">
          <Zap className="text-ami-orange" /> Proof of Concept & Future Potential
        </h3>
        
        <p className="text-slate-300 leading-relaxed mb-8 relative z-10">
          More than just a prototype, this initiative serves as a scalable proof of concept. It proves that by combining robust automation pipelines with the ElevenLabs V3 engine, high-fidelity audio entertainment can be generated at unprecedented scale and velocity.
        </p>
        
        <div className="grid md:grid-cols-2 gap-6 relative z-10">
          
          {/* Bingo Card */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-white/5 hover:border-ami-orange/50 transition-colors group">
            <h4 className="text-xl font-black text-white mb-3 tracking-tight group-hover:text-ami-orange transition-colors">
              Infinite Bingo Customization
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Standard bingo is a universally popular, timeless experience. By harnessing creative voice character creation, thematic writing, and V3's emotional range, AMI can now deliver bespoke, hyper-localized bingo experiences tailored to the exact wants, needs, and vibe of any venue.
            </p>
          </div>
          
          {/* Trivia Card */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-white/5 hover:border-blue-500/50 transition-colors group">
            <h4 className="text-xl font-black text-white mb-3 tracking-tight group-hover:text-blue-400 transition-colors">
              Rapid Trivia Deployment
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Building on AMI’s established legacy of TV and App-based trivia, this expands our presence into a game format that is simultaneously new yet deeply familiar. The true power lies in velocity: using this engine, fully produced trivia games on any niche subject can be written, generated, and deployed in <strong>days, rather than weeks</strong>.
            </p>
          </div>

        </div>
      </section>
	  

      {/* SECTION 5: THE DELIVERY MECHANISM */}
      <section className="bg-slate-900 border border-ami-orange/20 rounded-3xl p-8 shadow-[0_0_30px_rgba(249,115,22,0.05)]">
        <h3 className="text-2xl font-black text-white mb-4 flex items-center gap-3">
          <Code className="text-ami-orange" /> Why Build a Demo Web App?
        </h3>
        <p className="text-slate-300 leading-relaxed text-sm">
          Delivering a ZIP file containing 500+ MP3s places the burden of imagination entirely on the stakeholder. By developing this React-based Progressive Web App (PWA), it simulates the actual end-user experience. Features like exposing the Scripts with tags included during audio playback demonstrate the script creation process. Including "Locked" Host tracks, algorithmic shuffling, and a persistent audio player demonstrate not just the audio quality, but how the product functions in a real-world venue environment.
        </p>
      </section>

    </div>
  );
}