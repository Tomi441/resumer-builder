import React, { useState, useEffect } from 'react';
import { FaDownload } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Template1 = () => {
  const [personalInfo, setPersonalInfo] = useState({
    name: 'Name Surname',
    title: 'Title',
    profile: 'Lorem ipsum dolor sit amet consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.',
  });

  const [contact, setContact] = useState({
    phone: '558-878-028',
    address: '5520 Main Street Lorem ipsum',
    email: 'lorem@ipsum.com',
    website: 'www.lorem.ipsum',
  });

  const [languages, setLanguages] = useState([
    { name: 'English', level: 100 },
    { name: 'German', level: 80 },
    { name: 'Spanish', level: 60 },
  ]);

  const [skills, setSkills] = useState([
    { name: 'Graphic design', level: 90 },
    { name: '3D Graphic design', level: 80 },
    { name: 'Webdesign', level: 70 },
    { name: 'Photography', level: 60 },
    { name: 'Typography', level: 50 },
  ]);

  const [achievements, setAchievements] = useState([
    { year: '2010', description: 'Lorem ipsum' },
    { year: '2012', description: 'Lorem ipsum' },
  ]);

  const [education, setEducation] = useState([
    { year: '1993-1996', description: 'Lorem ipsum dolor sit amet' },
    { year: '1996-2000', description: 'Lorem ipsum dolor' },
    { year: '2000-2004', description: 'Lorem ipsum dolor sit amet consetetur' },
  ]);

  const [workExperience, setWorkExperience] = useState([
    { year: '2005-2010', description: 'Lorem ipsum dolor sit amet consetetur' },
    { year: '2010-2015', description: 'Lorem ipsum dolor' },
    { year: '2015-2016', description: 'Lorem ipsum dolor sit amet' },
  ]);

  const [hobbies, setHobbies] = useState(['Music, Films, Traveling', 'Cycling']);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDownload = (fileType) => {
    const resumeElement = document.getElementById('resume');
    html2canvas(resumeElement)
      .then((canvas) => {
        const imgData = canvas.toDataURL(`image/${fileType === 'pdf' ? 'jpeg' : fileType}`);
        const pdf = new jsPDF('p', 'mm', 'a4');
        if (fileType === 'pdf') {
          const width = pdf.internal.pageSize.getWidth();
          const height = pdf.internal.pageSize.getHeight();
          pdf.addImage(imgData, 'JPEG', 0, 0, width, height);
          pdf.save('resume.pdf');
        } else {
          const link = document.createElement('a');
          link.href = imgData;
          link.download = `resume.${fileType}`;
          link.click();
        }
      })
      .catch((error) => console.error('Error generating file:', error));
  };

  useEffect(() => {
    // Fetch data from an API or database
    // and update the corresponding state variables
  }, []);

  return (
    <div id="resume" className="resume-container">
      <div className="personal-info">
        <div className="avatar">
          {/* Add avatar image */}
        </div>
        <div className="name-title">
          <input
            type="text"
            name="name"
            value={personalInfo.name}
            onChange={handleFormChange}
          />
          <input
            type="text"
            name="title"
            value={personalInfo.title}
            onChange={handleFormChange}
          />
        </div>
        <div className="profile">
          <textarea
            name="profile"
            value={personalInfo.profile}
            onChange={handleFormChange}
          />
        </div>
      </div>

      <div className="contact">
        <h3>CONTACT</h3>
        <div className="contact-info">
          <p>
            <span>Phone:</span>
            <input
              type="text"
              name="phone"
              value={contact.phone}
              onChange={(e) => setContact({ ...contact, phone: e.target.value })}
            />
          </p>
          <p>
            <span>Address:</span>
            <input
              type="text"
              name="address"
              value={contact.address}
              onChange={(e) => setContact({ ...contact, address: e.target.value })}
            />
          </p>
          <p>
            <span>Email:</span>
            <input
              type="text"
              name="email"
              value={contact.email}
              onChange={(e) => setContact({ ...contact, email: e.target.value })}
            />
          </p>
          <p>
            <span>Website:</span>
            <input
              type="text"
              name="website"
              value={contact.website}
              onChange={(e) => setContact({ ...contact, website: e.target.value })}
            />
          </p>
        </div>
      </div>

      <div className="languages">
        <h3>LANGUAGES</h3>
        {languages.map((language, index) => (
          <div key={index} className="language">
            <input
              type="text"
              value={language.name}
              onChange={(e) => {
                const updatedLanguages = [...languages];
                updatedLanguages[index].name = e.target.value;
                setLanguages(updatedLanguages);
              }}
            />
            <input
              type="range"
              min="0"
              max="100"
              value={language.level}
              onChange={(e) => {
                const updatedLanguages = [...languages];
                updatedLanguages[index].level = parseInt(e.target.value);
                setLanguages(updatedLanguages);
              }}
            />
          </div>
        ))}
      </div>

      <div className="skills">
        <h3>SKILLS</h3>
        {skills.map((skill, index) => (
          <div key={index} className="skill">
            <input
              type="text"
              value={skill.name}
              onChange={(e) => {
                const updatedSkills = [...skills];
                updatedSkills[index].name = e.target.value;
                setSkills(updatedSkills);
              }}
            />
            <input
              type="range"
              min="0"
              max="100"
              value={skill.level}
              onChange={(e) => {
                const updatedSkills = [...skills];
                updatedSkills[index].level = parseInt(e.target.value);
                setSkills(updatedSkills);
              }}
            />
          </div>
        ))}
      </div>

      <div className="achievements">
        <h3>MY ACHIEVEMENTS</h3>
        {achievements.map((achievement, index) => (
          <div key={index} className="achievement">
            <input
              type="text"
              value ={achievement.year}
              onChange={(e) => {
                const updatedAchievements = [...achievements];
                updatedAchievements[index].year = e.target.value;
                setAchievements(updatedAchievements);
              }}
            />
            <input
              type="text"
              value={achievement.description}
              onChange={(e) => {
                const updatedAchievements = [...achievements];
                updatedAchievements[index].description = e.target.value;
                setAchievements(updatedAchievements);
              }}
            />
          </div>
        ))}
      </div>

      <div className="education">
        <h3>EDUCATION</h3>
        {education.map((edu, index) => (
          <div key={index} className="education-item">
            <input
              type="text"
              value={edu.year}
              onChange={(e) => {
                const updatedEducation = [...education];
                updatedEducation[index].year = e.target.value;
                setEducation(updatedEducation);
              }}
            />
            <input
              type="text"
              value={edu.description}
              onChange={(e) => {
                const updatedEducation = [...education];
                updatedEducation[index].description = e.target.value;
                setEducation(updatedEducation);
              }}
            />
          </div>
        ))}
      </div>

      <div className="work-experience">
        <h3>WORK EXPERIENCE</h3>
        {workExperience.map((exp, index) => (
          <div key={index} className="experience-item">
            <input
              type="text"
              value={exp.year}
              onChange={(e) => {
                const updatedWorkExperience = [...workExperience];
                updatedWorkExperience[index].year = e.target.value;
                setWorkExperience(updatedWorkExperience);
              }}
            />
            <input
              type="text"
              value={exp.description}
              onChange={(e) => {
                const updatedWorkExperience = [...workExperience];
                updatedWorkExperience[index].description = e.target.value;
                setWorkExperience(updatedWorkExperience);
              }}
            />
          </div>
        ))}
      </div>

      <div className="hobbies">
        <h3>HOBBIES</h3>
        {hobbies.map((hobby, index) => (
          <input
            key={index}
            type="text"
            value={hobby}
            onChange={(e) => {
              const updatedHobbies = [...hobbies];
              updatedHobbies[index] = e.target.value;
              setHobbies(updatedHobbies);
            }}
          />
        ))}
      </div>

      <div className="download-options">
        <button onClick={() => handleDownload('pdf')}>
          <FaDownload /> Download PDF
        </button>
        <button onClick={() => handleDownload('png')}>
          <FaDownload /> Download PNG
        </button>
        <button onClick={() => handleDownload('jpg')}>
          <FaDownload /> Download JPG
        </button>
        <button onClick={() => handleDownload('svg')}>
          <FaDownload /> Download SVG
        </button>
      </div>
    </div>
  );
};

export default Template1;