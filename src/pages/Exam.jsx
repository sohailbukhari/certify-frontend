import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import Loader from '../components/Loader';

import http from '../utils/http';

const Exam = () => {
  const [categories, setCategories] = useState([]);
  const [choice, setChoice] = useState('');
  const [loading, setLoading] = useState(true);

  // state variables for conduction test
  const [test, setTest] = useState(null);
  const [pointer, setPointer] = useState(0);
  const [timeleft, setTimeleft] = useState(null);

  const [answer, setAnswer] = useState({});
  const [answers, setAnswers] = useState({});

  const [result, setResult] = useState(null);

  const navigate = useNavigate();

  const next = () => {
    const val = pointer + (1 % test.questions.length);
    if (val < 20) setPointer(pointer + (1 % test.questions.length));
  };

  const submitAnswer = async () => {
    if (answers[answer.question_id]) return next();

    try {
      await http.put(`/tests/${test._id}/submit-answer`, { _id: answer.question_id, answer: answer.answer });
      const newAnswers = Object.assign({}, answers);
      newAnswers[answer.question_id] = answer.answer;
      setAnswers(newAnswers);

      if (pointer === test.questions.length - 1) {
        submitTest();
      }

      next();
    } catch (err) {
      toast.error('Oops! Something went wrong');
    }
  };

  const getCategories = async () => {
    try {
      const res = await http.get('/categories');
      setCategories(res.data.data);
    } catch (err) {}
  };

  const startTest = async () => {
    try {
      const res = await http.post('/tests', { category: choice });

      setTimeleft(calculateTimeLeft(res.data.data.expiry));

      setTest(res.data.data);
      toast.success('Best of luck!');
    } catch (err) {
      toast.error('Oops! Something went wrong');
    }
  };

  const submitTest = async () => {
    try {
      const res = await http.post(`/tests/${test._id}/submit`);
      console.log(res.data.data);
      setResult(res.data.data);
    } catch (err) {
      toast.error('Oops! Something went wrong');
    }
  };

  const resultRedirect = () => {
    if (result.passed) navigate('/dashboard/certificates');
    else navigate('/dashboard');
  };

  const getCurrentTest = async () => {
    setLoading(true);
    try {
      const res = await http.get('/tests/currently-active');

      const leftduration = calculateTimeLeft(res.data.data.expiry);
      setTimeleft(leftduration);

      let skipPointer = 0;

      res.data.data.questions.map((question) => {
        if (res.data.data.answers && res.data.data.answers[question._id]) {
          console.log('SKIPPING');
          skipPointer++;
        }
      });

      setPointer(skipPointer);

      setAnswers(res.data.data.answers);
      setTest(res.data.data);

      if (leftduration.minutes < 5) toast.info('Hurry up time ending soon');
      else toast.info('Welcome Back');
    } catch (err) {}

    setLoading(false);
  };

  setInterval(() => {
    if (test) setTimeleft(calculateTimeLeft(test.expiry));
  }, 1000);

  useEffect(() => {
    getCategories();
    getCurrentTest();
  }, []);

  if (loading) return <Loader />;

  if (result)
    return (
      <div>
        <div className='overflow-hidden bg-white shadow sm:rounded-lg'>
          <div className='flex justify-between items-center'>
            <div className='px-4 py-5 sm:px-6'>
              <h3 className='text-lg font-medium leading-6 text-gray-900'>Your Test Result</h3>
              <p className='mt-1 max-w-2xl text-sm text-gray-500'>Summary</p>
            </div>
          </div>

          <div className='border-t border-gray-200'>
            <dl>
              <div className='bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                <dt className='text-sm font-bold text-gray-500 '>Total Questions</dt>
                <dd className='mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'> {result.total_questions}</dd>
              </div>
              <div className='bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                <dt className='text-sm font-bold text-gray-500 '>Correct Answers</dt>
                <dd className='mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'> {result.correct_answers}</dd>
              </div>
              <div className='bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                <dt className='text-sm font-bold text-gray-500 '>Score</dt>
                <dd className='mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'> {result.score} %</dd>
              </div>
              <div className='bg-gray-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                <dt className='text-sm font-bold text-gray-500 '>Verdit</dt>
                <dd className='mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'> {result.passed ? 'PASSED' : 'FAILED'} </dd>
              </div>
              <div className='bg-gray-5px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                <dt className='text-sm font-bold text-gray-500 sm:col-span-2'></dt>
                <dd className='mt-1 text-sm text-gray-900  sm:mt-0 flex justify-end'>
                  <button onClick={resultRedirect} className='border px-4 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700' type='submit'>
                    {result.passed ? 'View Certificates' : 'Go Back'}
                  </button>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    );

  if (test)
    return (
      <div>
        <div className='overflow-hidden bg-white shadow sm:rounded-lg'>
          <div className='flex justify-between items-center'>
            <div className='px-4 py-5 sm:px-6'>
              <h3 className='text-lg font-medium leading-6 text-gray-900'>Exam</h3>
              <p className='mt-1 max-w-2xl text-sm text-gray-500'>
                {test.category.replace('-', ' ').toUpperCase()} ( {pointer + 1} / {test.questions.length} ){' '}
              </p>
            </div>
            <div className='p-3'>
              <ShowTimer time={timeleft} />
            </div>
          </div>

          <div className='border-t border-gray-200'>
            <dl>
              <div className='bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                <dt className='text-sm font-bold text-gray-500 '>Question</dt>
                <dd className='mt-1 text-sm text-gray-900 sm:col-span-3 sm:mt-0'>{test.questions[pointer].text}</dd>
              </div>
              <div className='bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                <dt className='text-sm font-medium text-gray-500'>Answer ( Options )</dt>
                <dd className='mt-1 text-sm text-gray-900 sm:col-span-3 sm:mt-0'>
                  <ul className='space-y-4'>
                    {test.questions[pointer].options.map((text, key) => {
                      const question_id = test.questions[pointer]._id;

                      const current = answers ? (answers[question_id] ? answers[question_id] === text : answer.answer === text ? true : false) : false;

                      return (
                        <li
                          key={key}
                          onClick={() => setAnswer({ question_id, answer: text })}
                          className={`border border-dotted cursor-pointer p-2 rounded-md hover:bg-blue-600 hover:text-white ${current ? 'bg-blue-600 text-white' : ''} `}>
                          {text}
                        </li>
                      );
                    })}
                  </ul>
                </dd>
              </div>
              <div className='bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                {test.questions.length === pointer + 1 ? (
                  <>
                    <div></div>
                    <div></div>
                    <button onClick={submitAnswer} className='px-3 py-2 border rounded-lg bg-sky-600 text-white hover:bg-sky-700 '>
                      Submit
                    </button>
                  </>
                ) : (
                  <>
                    <div></div>
                    <div></div>
                    <button onClick={submitAnswer} className='px-3 py-2 border rounded-lg bg-sky-600 text-white hover:bg-sky-700 '>
                      Next
                    </button>
                  </>
                )}
              </div>
            </dl>
          </div>
        </div>
      </div>
    );

  return (
    <div className='space-y-6'>
      <div className='overflow-hidden bg-white shadow sm:rounded-lg'>
        <div className='flex flex-col sm:flex-row py-4 justify-between items-center'>
          <div className='px-4 py-5 sm:px-6'>
            <h3 className='text-lg font-medium leading-6 text-gray-900'>Certification Category</h3>
            <p className='mt-1 max-w-2xl text-sm text-gray-500'>Select your Skill</p>
            <select
              className='mt-4 border px-3 py-2 rounded-md'
              value={choice}
              onChange={(e) => {
                setChoice(e.target.value);
              }}>
              <option value={''}> Select Category</option>
              {categories.map((category, key) => {
                return (
                  <option key={key} value={category.handle}>
                    {category.name}
                  </option>
                );
              })}
            </select>
          </div>
          {choice && (
            <div className='px-3'>
              <button onClick={startTest} className='border px-4 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700' type='submit'>
                Start Test
              </button>
            </div>
          )}
        </div>
      </div>

      {choice && (
        <div className='py-4 border-4 border-dotted p-4 rounded-lg'>
          <span className='text-lg font-bold'> Here</span> you can attempt our test and get a passing score in ordeer to get certified to avail our special services
          <br />
          Kindly ensure that you have a stable internet connection before you attempt our test. There will be time duration of 20 seconds for each question whenever you are ready click on Start Test
        </div>
      )}
    </div>
  );
};

export default Exam;

function calculateTimeLeft(time) {
  let difference = new Date(time) - new Date();

  let timeLeft = {};

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  } else return null;

  return timeLeft;
}

function ShowTimer({ time }) {
  if (!time) return;

  return (
    <div className='flex space-x-4 border p-4 rounded-lg max-w-max'>
      <div className='text-center'>
        <h2 className='text-xl font-bold'>{time.minutes}</h2>
        <p className='text-sm'>Minutes</p>
      </div>
      <div className='border-l pl-4 text-center'>
        <h2 className='text-xl font-bold'>{time.seconds}</h2>
        <p className='text-sm'>Seconds</p>
      </div>
    </div>
  );
}
