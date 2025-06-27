import { useState, useEffect } from 'react';
import './Home.css';

function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(0);
  
  const languages = ['Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Japanese'];
  
  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentLanguage((prev) => (prev + 1) % languages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='page-background'>
      {/* Hero Section */}
      <div className='hero-container'>
        <div className={`hero-content ${isVisible ? 'hero-content-visible' : 'hero-content-hidden'}`}>
          <h1 className='hero-title'>
            Fluent Friend
          </h1>
          <div className='hero-subtitle'>
            Practice <span className='language-rotator'>{languages[currentLanguage]}</span> like you have a fluent friend
          </div>
          <p className='hero-description'>
            Designed for intermediate learners who want to <em className='hero-emphasis'>practice</em>, not start from scratch. 
            Build real fluency through conversation and AI-powered feedback.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className='cta-buttons-container'>
          <button className='cta-primary'>
            Start Practicing Free
          </button>
          <button className='cta-secondary'>
            Watch Demo
          </button>
        </div>

        {/* Learning Method Section */}
        <div className='learning-method-section'>
          <div className='section-header'>
            <h2 className='section-title'>🧠 Science-Backed Learning</h2>
            <p className='section-subtitle'>
              Built on <strong className='text-highlight'>active recall</strong> — the most effective method for building 
              long-term memory and real fluency, proven by decades of cognitive research.
            </p>
          </div>
          
          <div className='learning-steps-grid'>
            {[
              {
                step: '01',
                title: 'Recall',
                description: 'Challenge yourself to express thoughts without hints. Retrieving from memory builds stronger neural pathways than passive reading.',
                icon: '🎯'
              },
              {
                step: '02', 
                title: 'Get Feedback',
                description: 'Mistakes are learning opportunities. Get instant, personalized AI corrections that explain not just what, but why.',
                icon: '💡'
              },
              {
                step: '03',
                title: 'Retry & Reinforce', 
                description: 'Practice the correction immediately. This spaced repetition solidifies the knowledge and prevents future mistakes.',
                icon: '🔄'
              }
            ].map((item, index) => (
              <div key={index} className='learning-step-card'>
                <div className='step-card-content'>
                  <div className='step-icon-container'>
                    <div className='step-icon-circle'>
                      {item.icon}
                    </div>
                    <div className='step-number'>{item.step}</div>
                  </div>
                  <div>
                    <h3 className='step-title'>{item.title}</h3>
                    <p className='step-description'>{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className='features-section'>
          <h2 className='section-title-center'>✨ Everything You Need to Practice</h2>
          
          <div className='features-grid'>
            <div className='feature-card-chat'>
              <div className='feature-icon'>💬</div>
              <h3 className='feature-title'>Chat with Fin</h3>
              <p className='feature-description'>
                Have natural conversations with Fin, your AI language partner. He's patient, encouraging, 
                and always ready to help you improve — no judgment, just progress.
              </p>
              <div className='feature-example-chat'>
                <p className='example-text'>
                  "¿Cómo estuvo tu día?" <br/>
                  <span className='example-feedback'>→ Instant feedback on grammar, vocabulary, and naturalness</span>
                </p>
              </div>
            </div>

            <div className='feature-card-journal'>
              <div className='feature-icon'>📝</div>
              <h3 className='feature-title'>Journal Mode</h3>
              <p className='feature-description'>
                Write freely about your day, thoughts, or dreams. Track your progress over time 
                and watch your writing skills flourish.
              </p>
              <div className='feature-example-journal'>
                <p className='example-text'>
                  Smart corrections and suggestions help you learn from every entry
                  <span className='example-coming-soon'>🚀 AI-powered feedback coming soon</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Proof / Trust Section */}
        <div className='social-proof-section'>
          <div className='social-proof-card'>
            <h3 className='social-proof-title'>Join Intermediate Learners Worldwide</h3>
            <div className='stats-container'>
              <div className='stat-item'>
                <div className='stat-number'>500+</div>
                <div className='stat-label'>Active Learners</div>
              </div>
              <div className='stat-item'>
                <div className='stat-number'>15+</div>
                <div className='stat-label'>Languages</div>
              </div>
              <div className='stat-item'>
                <div className='stat-number'>4.8★</div>
                <div className='stat-label'>User Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className='final-cta-section'>
          <h3 className='final-cta-title'>Ready to practice like never before?</h3>
          <p className='final-cta-description'>
            No more boring textbooks. No more fear of making mistakes. Just real conversations that build real fluency.
          </p>
          <button className='cta-final'>
            Start Your First Conversation
          </button>
          <p className='cta-disclaimer'>Free to try • No credit card required</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
