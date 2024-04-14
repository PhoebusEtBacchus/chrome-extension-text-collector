import React, { useState, useEffect } from 'react';
import './App.css';
import { Snippet, SnippetList } from './components/SnippetList';
import axios from 'axios'
import { SnippetItem } from './components/SnippetItem';
import { MiniSnippetItem } from './components/MiniSnippet'
import { AutoComplete } from "antd";

function App() {
  const [courseInput, setCourseInput] = useState('');
  const [courseResult, setCourseResult] = useState({description: 'No Course Selected'});

  const rootURL = 'https://penncoursereview.com/api/base/current/courses';

  // asynchronously calls the penn course review API with the input course
  const fetchCourse = async () => {
    try {
      const response = await axios.get(`${rootURL}/${courseInput}`);
      setCourseResult({description : response.data.description});
      console.log(response);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
  };

  // whenever the inputcourse changes, it calls fetchCourse 
  useEffect(() => {
    chrome.storage.local.get('inputcourse', (result) => {
      if (result === undefined) {
        setCourseResult({description : 'no course'});
      } else {
        setCourseInput(result.inputcourse);
      }
    });
    fetchCourse();
  }, [courseInput]);

  const options = [
    { value: 'Burns Bay Road' },
    { value: 'Downing Street' },
    { value: 'Wall Street' },
  ];

  return (
    <div className="App">
      
      <AutoComplete
        style={{ width: 200 }}
        options={options}
        placeholder="type course title"
        filterOption={(inputValue, option) =>
          option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
        }
      />

      <h1>Penn Course Review Extension</h1>
      {/* Render the SnippetList component with the snippets and event handlers */}
      <MiniSnippetItem text={courseInput} />
      <MiniSnippetItem text={courseResult.description} />
    </div>
  );
}

export default App;