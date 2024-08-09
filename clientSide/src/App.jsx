import { useState, useEffect } from 'react'
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Person from './components/Person';
import personService from './services/persons';
import Notification from './components/Notification';
import ErrorNotification from './components/ErrorNotification';


const App = () => {
  const [info, setInfo] = useState([]);
  const [newName, setNewName] = useState('');
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [newContent, setNewContent] = useState('');
  const [search, setSearch] = useState('');
  const [Error, setError] = useState(false);
  const [notification, setNotification] = useState(null);
  const [changedNotification, setChangedNotification] = useState(null);
  const [errorNotification, setErrorNotification] = useState(null);



  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setInfo(response.data);
      })
  }, []);

  const addNewInfo = (event) => {
    event.preventDefault();
    const infoObject = {
      'name': newName,
      'number': newPhoneNumber,
      'content': newContent
    }

    // if the person already existed 'don't add'
    const existedPerson = info.find((info) => info.name === newName)

    if (!existedPerson) {
      personService
        .create(infoObject)
        .then(response => {
          console.log(response.data.name)
          setNotification(`Added ${response.data.name}`);
          setInfo(info.concat(response.data));

          setTimeout(() => {
            setNotification(null)
          }, 2000);
        })
      setNewName('');
      setNewPhoneNumber('');
      setNewContent('');
    } else {
      if (window.confirm(`${existedPerson.name} is already added to the phonebook, replace the old number with a new one?`)) {
        personService
          .update(existedPerson.id, infoObject)
          .then(response => {
            setInfo(
              info.map(person =>
                person.id !== existedPerson.id ? person : response.data
              )
            );
            setNewName('');
            setNewPhoneNumber('');
            setChangedNotification(`${response.data.name}'s number has been changed!`)
            setTimeout(() => {
              setChangedNotification(null);
            }, 2000);
          })
          .catch(error => {
            setError(error);
            setErrorNotification(`Information of ${existedPerson.name} has already been removed from server`);
            setTimeout(() => {
              setErrorNotification(null);
            }, 2000);
            console.error('Error updating person:', error);
          });
      }
    }
  }


  const handlePerson = (event) => {
    setNewName(event.target.value);
  }

  const handleNewPhoneNumber = (event) => {
    setNewPhoneNumber(event.target.value);
  }

  const handleNewContent = (event) => {
    setNewContent(event.target.value);
  }

  const filteredInfo = info.filter(person =>
    person.name.toLowerCase().includes(search.toLowerCase())
  );


  const handleSearch = (event) => {
    setSearch(event.target.value.toLowerCase());
  }

  // When delete the person and phone number 
  const handleDelete = (id) => {
    const person = info.find((person) => person.id == id);
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .destroy(person.id)
        .then(() => {
          setInfo(info.filter((person) => person.id !== id));
        });
    }
  }



  return (
    <div>
      <h2>Phonebook</h2>

      {notification !== null && <Notification message={notification} />}

      {changedNotification !== null && <Notification message={changedNotification} />}

      {errorNotification !== null && <ErrorNotification message={errorNotification} />}


      <Filter type="text" onChange={handleSearch} />

      <h2>add a new</h2>

      <PersonForm
        onSubmit={addNewInfo}
        newName={newName}
        newPhoneNumber={newPhoneNumber}
        newContent={newContent}
        onChange={handleNewPhoneNumber}
        handlePerson={handlePerson}
        handleContent={handleNewContent}
      />


      <h3>Numbers</h3>

      <Person filteredInfo={filteredInfo} onDelete={handleDelete} />
    </div>
  );

}

export default App
