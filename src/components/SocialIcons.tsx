
import { Youtube } from 'lucide-react';

const SocialIcons = () => {
  const socialLinks = [
    {
      name: 'YouTube',
      icon: <Youtube className="social-icon" />,
      url: 'https://www.youtube.com/@N3O-STUD1O5'
    },
    {
      name: 'YouTube Music',
      icon: (
        <svg className="social-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path d="M10 8.5L16 12L10 15.5V8.5Z" fill="currentColor" />
        </svg>
      ),
      url: 'https://music.youtube.com/channel/UCuyY0KPfckK4mi-pmac8w4A'
    },
    {
      name: 'Spotify',
      icon: (
        <svg className="social-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM16.75 16.25C16.5 16.5 16 16.5 15.75 16.25C14 15 11.75 14.5 7.75 15.25C7.5 15.25 7 15 7 14.5C7 14.25 7.25 13.75 7.75 13.75C12 13 14.5 13.5 16.5 14.75C16.75 15 16.75 16 16.75 16.25ZM18 13.25C17.75 13.5 17.25 13.5 17 13.25C15 12 11.5 11.25 7.75 12.25C7.5 12.25 7 12 7 11.5C7 11 7.5 10.75 7.75 10.75C12 9.75 15.75 10.5 18 12C18.25 12.25 18.25 13 18 13.25ZM18.25 10.25C16 9 10.75 8.75 7.25 9.75C6.75 9.75 6.5 9.5 6.5 9C6.5 8.5 6.75 8.25 7.25 8C11.25 7 16.75 7.25 19.25 8.75C19.75 9 19.75 9.25 19.75 9.75C19.5 10 19 10.5 18.25 10.25Z" fill="currentColor"/>
        </svg>
      ),
      url: 'https://open.spotify.com/artist/7g1t8aR8ksGZPVDLhemiRt'
    },
    {
      name: 'X (Twitter)',
      // Custom X logo with proper styling
      icon: (
        <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      url: 'https://x.com/n3ostudios'
    }
  ];

  return (
    <div className="flex gap-6">
      {socialLinks.map((social, index) => (
        <a 
          key={index} 
          href={social.url} 
          target="_blank" 
          rel="noreferrer"
          aria-label={`Visit N3O Studios on ${social.name}`}
        >
          {social.icon}
        </a>
      ))}
    </div>
  );
};

export default SocialIcons;
