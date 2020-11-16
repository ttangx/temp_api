import React, { useState, useEffect } from 'react';

const useStateWithLocalStorage = localStorageKey => {
    const [value, setValue] = useState(
        localStorage.getItem(localStorageKey) || ''
    );
   
    useEffect(() => {
      localStorage.setItem(localStorageKey, value);
    }, [value]);
   
    return [value, setValue];
  };

const useStateWithLocalStorageDict = localStorageKey => {
    const [value, setValue] = useState(
        JSON.parse(localStorage.getItem(localStorageKey)) || {}
    );
   
    useEffect(() => {
      localStorage.setItem(localStorageKey, JSON.stringify(value));
    }, [value]);
   
    return [value, setValue];
  };
  
function RestaurantList() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [checked, setChecked] = useStateWithLocalStorageDict('checked');
  const [zip, setZip] = useState();
  const onChange = event => {
        setChecked(prev => {prev[event.target.id] = event.target.checked; return prev;})
    };


  const onSearch = event => {
    if (event.key === 'Enter') {
      setZip(event.target.value);
      fetch(`https://ttangx.s3.amazonaws.com/${event.target.value}.json`)
      .then(res => res.json())
      .then(
        (result) => {
          result.results.forEach(rest =>
            rest.selected = checked[rest.place_id]);
          setRestaurants(result.results);
          setIsLoaded(true);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
    }
  };
  let list;
  if (zip) {
    if (error) {
        list = <div>Error: {error.message}</div>;
      } else if (!isLoaded) {
        list = <div>Loading...</div>;
      } else {
        list = <div>
            You have selected: {zip}
            <ul>
                {restaurants.map(item => (
                
                <li key={item.id}>
                    <input type="checkbox" id={item.place_id} name={item.name} checked={checked[item.place_id]} onChange={onChange}/>
                    {item.name} {item.price}
                </li>
                ))}
            </ul>
        </div>
    }
  } else {
    list = <div>Please enter a zip</div>
  }

  return <div>
    <input type="text" onKeyDown={onSearch} />
    {list}
</div>;
}

export default RestaurantList;
