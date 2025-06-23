import './Home.css'

function Home() {
  return (
    <div className='flex flex-col items-center'>
      <h1 className='p-2 m-2 text-center'>
        Fluent Friend: Practice any language as if you had a fluent friend
      </h1>
      <h2>
        Designed on the Recall-Repeat approach for intermediate language learners
      </h2>
      <ol>
        <li>
          <h3>Recall</h3>
          <p>
            Recalling how to say something from memory is a proven
            key component of learning a language
          </p>
        </li>
        <li>
          <h3>Fail</h3>
          <p>
            Getting immediate feedback on your recall 
            lets you know what you got wrong
          </p>
        </li>
        <li>
          <h3>Retry</h3>
          <p>
            Try again, but apply what you learned from the last step.
            It'll strengthen your understanding
          </p>
        </li>
      </ol>
      <h2>Features</h2>
      <ol>
        <li>
          <h3>💬 Chat</h3>
          <p>
            Text with a snarky chat bot named Fin. He'll give you
            corrections as you go.
            * corrections are AI 
          </p>
        </li>
        <li>
          <h3>📝 Journal</h3>
          <p>
            Journal: Write in a journal with an advanced spell checker
            * Languages limited, AI assissted corrections coming soon
          </p>
        </li>
      </ol>

    </div>
  )
}

export default Home
