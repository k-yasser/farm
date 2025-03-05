import { useState, useEffect } from "react";
import "./addAnimal.css"; // Import the CSS file

const AddAnimalForm = () => {
  const [animal, setAnimal] = useState({
    RFid:"",
    type: "",
    gender: "male",
    age: "",
    birthDate: "",
    owner: "",
  });

  const [animalTypes, setAnimalTypes] = useState([]);
  const [animals, setAnimals] = useState([]);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/v1/types");
        const data = await response.json();
        setAnimalTypes(data.data || []);
      } catch (error) {
        console.error("Error fetching types:", error);
      }
    };

    fetchTypes();
  }, []);

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/v1/animals");
        const data = await response.json();
        setAnimals(data.data || []);
      } catch (error) {
        console.error("Error fetching animals:", error);
      }
    };

    fetchAnimals();
  }, []);

  const handleChange = (e) => {
    setAnimal({ ...animal, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    const newAnimal = {
      type: animal.type,
      gender: animal.gender,
      age: parseInt(animal.age, 10),
      birthDate: animal.birthDate,
      owner: animal.owner || "Unknown Owner",
      RFid:animal.RFid
    };

    try {
      const response = await fetch("http://localhost:8000/api/v1/animals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAnimal),
      });

      if (!response.ok) {
        throw new Error("Failed to add animal");
      }

      alert("Animal added successfully!");
      setAnimal({ type: "", gender: "male", age: "", birthDate: "", owner: "",RFid:""});

      const updatedAnimals = await fetch("http://localhost:8000/api/v1/animals");
      const newAnimalData = await updatedAnimals.json();
      setAnimals(newAnimalData.data);
    } catch (error) {
      console.error("Error adding animal:", error);
      alert("Failed to add animal: " + error.message);
    }
  };

  return (
    <div className="container">
      <h2 className="title">Add New Animal</h2>
      <form onSubmit={handleSubmit} className="form">
        <select name="type" value={animal.type} onChange={handleChange} required className="input">
          <option value="">Select Animal Type</option>
          {animalTypes.map((type) => (
            <option key={type._id} value={type._id}>
              {type.name}
            </option>
          ))}
        </select>

        <select name="gender" value={animal.gender} onChange={handleChange} required className="input">
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <input type="number" name="age" placeholder="Age" value={animal.age} onChange={handleChange} required className="input" />

        <input type="date" name="birthDate" value={animal.birthDate} onChange={handleChange} required className="input" />
        <input type="String" name="RFid" value={animal.RFid} onChange={handleChange} className="input" />


        <button type="submit" className="button">Add Animal</button>
      </form>

      <h2 className="title">Animal List</h2>
      <ul className="animal-list">
        {animals.map((a) => (
          <li key={a._id} className="animal-item">
            <strong>Type:</strong> {a.type?.name || "Unknown"} | 
            <strong> Gender:</strong> {a.gender} | 
            <strong> Age:</strong> {a.age} years | 
            <strong>RFid:</strong> {a.RFid}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddAnimalForm;
