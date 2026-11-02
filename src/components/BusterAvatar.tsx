'use client';

export default function BusterAvatar({ mood, talking }: { mood: string; talking: boolean }) {
  const surprised = mood === 'surprised';
  const laughing = mood === 'laughing';
  const stern = mood === 'roasting';
  return <figure className={`buster-avatar ${talking ? 'is-speaking' : ''}`} aria-label={`Professor Buster: ${talking ? 'gapirmoqda' : mood}`}>
    <svg viewBox="0 0 260 250" role="img" aria-label="Ko‘zoynakli Professor Buster, ko‘k kostyumda">
      <circle cx="130" cy="120" r="105" fill="#e5efff"/>
      <circle cx="215" cy="62" r="8" fill="#93baff"/><circle cx="40" cy="159" r="5" fill="#2563eb"/>
      <ellipse cx="130" cy="236" rx="77" ry="8" fill="#c8dafa"/>
      <path d="M53 232 Q55 174 101 171 L159 171 Q205 175 207 232Z" fill="#2563eb"/>
      <path d="M107 171 L130 214 L153 171" fill="white"/>
      <path d="M104 172 L91 187 L115 210 L130 231 L125 201Z M156 172 L169 187 L145 210 L130 231 L135 201Z" fill="#174ab3"/>
      <path d="M120 189 L130 183 L140 189 L134 201 L138 219 L130 230 L122 219 L126 201Z" fill="#80b0ff"/>
      <rect x="113" y="150" width="34" height="29" rx="12" fill="#edb791"/>
      <ellipse cx="72" cy="112" rx="12" ry="18" fill="#f2c5a4"/><ellipse cx="188" cy="112" rx="12" ry="18" fill="#f2c5a4"/>
      <rect x="74" y="45" width="112" height="120" rx="51" fill="#f7ceae"/>
      <path d="M74 96 Q60 47 96 35 Q123 14 159 35 Q195 44 186 96 L174 71 Q150 77 125 55 Q106 78 84 74Z" fill="#244367"/>
      <path d="M91 45 Q118 26 145 39" fill="none" stroke="#577596" strokeWidth="7" strokeLinecap="round"/>
      <path d={stern ? 'M90 87 L112 94 M148 94 L170 87' : surprised ? 'M90 82 Q101 70 112 82 M148 82 Q159 70 170 82' : 'M90 87 Q102 80 113 87 M147 87 Q159 80 170 87'} fill="none" stroke="#244367" strokeWidth="5" strokeLinecap="round"/>
      <g fill="#fff8" stroke="#244367" strokeWidth="4"><circle cx="102" cy="108" r="22"/><circle cx="158" cy="108" r="22"/><path d="M124 107 Q130 103 136 107 M79 104 L71 100 M181 104 L189 100" fill="none"/></g>
      {laughing ? <path d="M94 109 Q102 99 110 109 M150 109 Q158 99 166 109" fill="none" stroke="#17355d" strokeWidth="4" strokeLinecap="round"/> : <g fill="#17355d"><ellipse cx="103" cy="108" rx="5" ry={surprised ? 8 : 6}/><ellipse cx="157" cy="108" rx="5" ry={surprised ? 8 : 6}/><circle cx="105" cy="106" r="2" fill="white"/><circle cx="159" cy="106" r="2" fill="white"/></g>}
      <path d="M130 111 L125 125 Q130 129 136 125" fill="none" stroke="#d69c78" strokeWidth="3" strokeLinecap="round"/>
      {talking || surprised ? <ellipse className="buster-mouth" cx="130" cy="143" rx="11" ry="9" fill="#723d37"/> : <path d={stern ? 'M116 145 Q130 138 144 145' : 'M114 138 Q130 155 146 138'} fill="none" stroke="#723d37" strokeWidth="4" strokeLinecap="round"/>}
      <rect x="169" y="204" width="20" height="5" rx="2" fill="#c7dfff"/>
    </svg>
    <figcaption><span/>{talking ? 'Buster gapirmoqda…' : 'Professor Buster · AI ustoz'}</figcaption>
  </figure>;
}
