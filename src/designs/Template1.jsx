import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaFilePdf, FaHouse, FaPenToSquare, FaPencil, FaPlus, FaTrash } from "react-icons/fa";
import { BiSolidBookmarks } from "react-icons/bi";
import { BsFiletypeJpg, BsFiletypePdf, BsFiletypePng, BsFiletypeSvg } from "react-icons/bs";
import { useQuery } from "react-query";
import { AnimatePresence, motion } from "framer-motion";
import { FadeInOutWithOpacityAlone, opacityINOut } from "../animations";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import useUser from "../hooks/useUser";
import { toast } from "react-toastify";
import { db, storage } from "../config/firebase.config";
import { getTemplateDetailEditByUser } from "../api";
import MainSpinner from "../components/MainSpinner";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { PuffLoader } from "react-spinners";


const Template1 = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const templateName = pathname?.split("/")?.slice(-1)[0];
  const { data: user } = useUser();
  const resumeRef = useRef(null);

  // State for managing edit mode
  const [isEdit, setIsEdit] = useState(false);

  // State for managing the image asset
  const [imageAsset, setImageAsset] = useState({
    isImageLoading: false,
    imageURL: null,
  });

  // State for form data including personal info, experiences, education, and skills
  const [formData, setFormData] = useState({
    fullname: "Karen Richards",
    professionalTitle: "Professional Title",
    personalDescription: "Your personal description here",
    refererName: "Sara Taylore",
    refererRole: "Director | Company Name",
    mobile: "+91 0000-0000",
    email: "urname@gmail.com",
    website: "urwebsite.com",
    address: "your street address, city, zip",
  });

  // State for experiences, skills, and education
  const [experiences, setExperiences] = useState([
    {
      id: 1, // Unique identifier for the experience
      year: "2019 - 2021",
      title: "Frontend Developer",
      company: "Tech Solutions Inc",
      description: "Developed and maintained user-facing features using React.js."
    },
    {
      id: 2,
      year: "2017 - 2019",
      title: "UI/UX Designer",
      company: "Creative Studio",
      description: "Designed user interfaces and experiences for mobile and web applications."
    },
    // ... Add more experiences as needed
  ]);
  
  const [skills, setSkills] = useState([
    { id: 1, name: 'Adobe Photoshop', level: 90 },
    { id: 2, name: 'HTML/CSS', level: 80 },
    { id: 3, name: 'JavaScript', level: 85 },
    { id: 4, name: 'UI/UX Design', level: 75 },
    // Add more skills as needed
  ]);
  

  const [education, setEducation] = useState([
    {
      major: "B.Sc. Computer Science",
      university: "Stanford University",
      year: "2011 - 2014"
    },
    {
      major: "M.Sc. Advanced Computing",
      university: "University of Chicago",
      year: "2014 - 2016"
    }
    // Add more entries as needed
  ]);
  

  // Hook for fetching resume data
  const {
    data: resumeData,
    isLoading: resume_isLoading,
    isError: resume_isError,
    refetch: refetch_resumeData,
  } = useQuery(["templateEditedByUser", `${templateName}-${user?.uid}`], () =>
    getTemplateDetailEditByUser(user?.uid, `${templateName}-${user?.uid}`)
  );

  // useEffect for initializing form data when resumeData is fetched
  useEffect(() => {
    if (resumeData?.formData) {
      setFormData(resumeData.formData);
    }
    if (resumeData?.experiences) {
      setExperiences(resumeData.experiences);
    }
    if (resumeData?.skills) {
      setSkills(resumeData.skills);
    }
    if (resumeData?.education) {
      setEducation(resumeData.education);
    }
    if (resumeData?.userProfilePic) {
      setImageAsset(prevAsset => ({
        ...prevAsset,
        imageURL: resumeData.userProfilePic,
      }));
    }
  }, [resumeData]);

 // Function to handle the image upload
 const handleFileSelect = async (event) => {
  const file = event.target.files[0]; // Get the file from the event
  if (file) {
    const fileType = file['type'];
    const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validImageTypes.includes(fileType)) {
      toast.error('This file is not an image');
      return;
    }
    setImageAsset((prevAsset) => ({ ...prevAsset, isImageLoading: true }));
    
    // Create a storage reference
    const storageRef = ref(storage, `profile-images/${Date.now()}-${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      },
      (error) => {
        console.log(error);
        toast.error('Error uploading file');
        setImageAsset((prevAsset) => ({ ...prevAsset, isImageLoading: false }));
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageAsset({ isImageLoading: false, imageURL: downloadURL });
          toast.success('Image uploaded successfully');
        });
      }
    );
  } else {
    // No file selected
    toast.error('No file selected');
  }
};

const toggleEditable = () => {
  setIsEdit((prevEdit) => {
    // If we're starting to edit, make all inputs and textareas editable
    if (!prevEdit) {
      const inputs = document.querySelectorAll('input, textarea');
      inputs.forEach(input => {
        input.removeAttribute('readOnly');
      });
    } else {
      // If we're finishing editing, make all inputs and textareas read-only again
      const inputs = document.querySelectorAll('input, textarea');
      inputs.forEach(input => {
        input.setAttribute('readOnly', true);
      });
    }
    return !prevEdit; // Toggle the isEdit state
  });
};

  // Form change handler
const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prevData) => ({
    ...prevData,
    [name]: value,
  }));
};


  // Experience handling
const handleExpChange = (index, e) => {
  const { name, value } = e.target;
  setExperiences((prevExperiences) => {
    const updatedExperiences = [...prevExperiences];
    updatedExperiences[index] = {
      ...updatedExperiences[index],
      [name]: value,
    };
    return updatedExperiences;
  });
};


const addExperience = () => {
  // Create a new experience object with default values
  const newExperience = {
    year: "Year Range",
    title: "New Job Position",
    companyAndLocation: "Company Name / Location",
    description: "Job description here.",
  };

  // Update the experiences state to include the new experience
  setExperiences([...experiences, newExperience]);
};


const removeExperience = (index) => {
  // Filter out the experience at the given index
  const updatedExperiences = experiences.filter((_, i) => i !== index);
  // Update the state with the new array of experiences
  setExperiences(updatedExperiences);
};


const handleSkillsChange = (index, e) => {
  const { name, value } = e.target;
  // Create a new array with the same objects except for the one being changed
  const updatedSkills = skills.map((skill, i) => {
    if (i === index) {
      // Return a new object with the updated values, but same structure
      return { ...skill, [name]: value };
    }
    return skill;
  });
  // Update the state with the new skills array
  setSkills(updatedSkills);
};


const addSkill = () => {
  // Create a new skill object with default values
  const newSkill = {
    title: "New Skill",
    percentage: "50", // Default skill level percentage
  };

  // Update the skills state to include the new skill
  setSkills([...skills, newSkill]);
};


const removeSkill = (index) => {
  // Create a new array that filters out the skill at the specified index
  const updatedSkills = skills.filter((_, i) => i !== index);
  // Update the state with the new skills array
  setSkills(updatedSkills);
};


const handleEducationChange = (index, e) => {
  const { name, value } = e.target;
  // Create a new array with updated education objects
  const updatedEducation = education.map((edu, i) => {
    if (i === index) {
      // Only update the object at the specified index
      return { ...edu, [name]: value };
    }
    return edu;
  });
  // Update the state with the new education array
  setEducation(updatedEducation);
};


const addEducation = () => {
  // Create a new education object with default values
  const newEducation = {
    major: "New Major",
    university: "New University",
    fromYear: "Start Year",
    toYear: "End Year" // Additional fields can be added as needed
  };

  // Update the education state to include the new education entry
  setEducation([...education, newEducation]);
};


const removeEducation = (index) => {
  // Create a new array that filters out the education entry at the specified index
  const updatedEducation = education.filter((_, i) => i !== index);
  // Update the state with the new education array
  setEducation(updatedEducation);
};


const saveFormData = async () => {
  const timeStamp = serverTimestamp();
  const resume_id = `${templateName}-${user?.uid}`;
  const imageURL = await getImage(); // Ensure getImage function is implemented to fetch or process the image URL
  
  const documentData = {
    _id: loadedTemplateId,
    resume_id,
    formData,
    education,
    experiences,
    skills,
    timeStamp,
    userProfilePic: imageAsset.imageURL,
    imageURL,
  };

  try {
    // Save the document data to the Firestore
    await setDoc(doc(db, "users", user?.uid, "resumes", resume_id), documentData);
    toast.success("Data Saved Successfully");
    refetch_resumeData(); // Refetch the resume data if necessary
  } catch (error) {
    console.error("Error saving data: ", error);
    toast.error(`Error saving data: ${error.message}`);
  }
};

const generatePDF = async () => {
  // Ensure the element exists
  const element = resumeRef.current;
  if (!element) {
    console.error("Unable to capture content. The DOM element is null.");
    toast.error("Failed to generate PDF: No content available.");
    return;
  }

  // Use html-to-image to convert the React DOM to an image
  try {
    const dataUrl = await htmlToImage.toPng(element);

    // Create a PDF from the image
    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4'
    });
    
     const getImage = async () => {
        const element = resumeRef.current;
        if (!element) {
            console.error("DOM element is not accessible");
            return null;
        }
        try {
            const dataUrl = await htmlToImage.toPng(element);
            return dataUrl;
        } catch (error) {
            console.error("Failed to convert image:", error);
            return null;
        }
    };

    const loadedTemplateId = resumeData?._id || 'defaultTemplateId'; // Adjust according to your data handling

    const deleteImageObject = () => {
        setImageAsset({ ...imageAsset, imageURL: null });
        toast.info('Image removed successfully');
    };


    const imgProps = pdf.getImageProperties(dataUrl);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    const verticalMargin = (pdf.internal.pageSize.getHeight() - pdfHeight) / 2;

    pdf.addImage(dataUrl, 'PNG', 0, verticalMargin, pdfWidth, pdfHeight);
    pdf.save('resume.pdf'); // Save the PDF with a dynamic filename if needed
  } catch (error) {
    console.error("Failed to generate PDF:", error);
    toast.error(`Failed to generate PDF: ${error.message}`);
  }
};


  // Loading and error handling
if (resume_isLoading) return <MainSpinner />;
if (resume_isError) {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <p className="text-lg text-red-500">Error loading the resume data. Please try again later.</p>
    </div>
  );
}


 // Render component
return (
  <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-1/4 bg-gray-800 text-white p-8 space-y-6">
          <div className="profile-image mb-4">
              {imageAsset.imageURL ? (
                  <img src={imageAsset.imageURL} alt="Profile" className="w-32 h-32 rounded-full mx-auto" />
              ) : (
                  <div className="w-32 h-32 bg-gray-400 rounded-full mx-auto flex items-center justify-center">
                      <span>No Image</span>
                  </div>
              )}
              {isEdit && (
                  <div className="mt-2 text-center">
                      <input type="file" onChange={handleFileSelect} className="text-sm text-blue-500"/>
                      {imageAsset.imageURL && (
                          <button onClick={() => setImageAsset({ ...imageAsset, imageURL: null })} className="ml-2 bg-red-500 text-white p-1 rounded">
                              Remove
                          </button>
                      )}
                  </div>
              )}
          </div>
          <div>
              <h3 className="text-lg font-bold">Contact Information</h3>
              <p>Email: {formData.email}</p>
              <p>Phone: {formData.mobile}</p>
              {/* Add more contact information fields as needed */}
          </div>
          {/* Include additional sections for references or other personal information as needed */}
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-white p-8">
          <header className="mb-4">
              <h1 className="text-3xl font-bold">{formData.fullname}</h1>
              <h2 className="text-xl text-gray-600">{formData.professionalTitle}</h2>
          </header>
          <section className="mb-4">
              <h3 className="text-2xl font-bold">About Me</h3>
              <p>{formData.personalDescription}</p>
          </section>
          {/* Experience Section */}
          <section className="mb-4">
              <h3 className="text-2xl font-bold">Experience</h3>
              {/* Map through experiences and render them */}
              {experiences.map((exp, index) => (
                  <div key={index} className="mb-2">
                      <h4 className="text-xl font-semibold">{exp.title}</h4>
                      <p>{exp.description}</p>
                  </div>
              ))}
          </section>
          {/* Skills Section */}
          <section className="mb-4">
              <h3 className="text-2xl font-bold">Skills</h3>
              {/* Map through skills and render them */}
              {skills.map((skill, index) => (
                  <div key={index} className="mb-2">
                      <span className="font-semibold">{skill.name}</span>: {skill.level}%
                  </div>
              ))}
          </section>
          {/* Control Buttons */}
          <div className="flex space-x-4">
              <button onClick={toggleEditable} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  {isEdit ? "Save" : "Edit"}
              </button>
              <button onClick={generatePDF} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                  Download PDF
              </button>
          </div>
      </main>
  </div>
);

  if (resume_isLoading) return <MainSpinner />;

  if (resume_isError) {
    return (
        <div className="w-full h-screen flex flex-col items-center justify-center">
            <p className="text-lg text-red-500">Unable to load the resume data. Please check your connection and try again.</p>
            <button onClick={() => refetch_resumeData()} className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Retry
            </button>
        </div>
    );
}

  // Here is the complete React component
  return (
    <div className="flex">
    {/* Sidebar */}
    <aside className="w-1/4 bg-gray-800 text-white p-8 space-y-6">
        {/* Profile image */}
        <div className="w-32 h-32 bg-gray-300 rounded-full overflow-hidden mx-auto">
            {imageAsset ? (
                <img src={imageAsset.imageURL} alt="Profile" className="w-full h-full object-cover" />
            ) : (
                <div className="flex items-center justify-center h-full">
                    {isEdit ? <input type="file" onChange={handleFileSelect} /> : "No Image"}
                </div>
            )}
            {isEdit && imageAsset.imageURL && (
                <button onClick={deleteImageObject} className="text-xs">Remove</button>
            )}
        </div>
        </aside>
  </div>
);
   
      {/* Contact Information */}
<div className="space-y-2">
    <h3 className="text-lg font-bold">Contact Information</h3>
    <div className="flex flex-col space-y-1">
        <label className="font-medium">Email:</label>
        <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            readOnly={!isEdit}
            className={`w-full p-2 rounded ${!isEdit ? "bg-gray-200" : "bg-white"}`}
        />

        <label className="font-medium">Phone:</label>
        <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            readOnly={!isEdit}
            className={`w-full p-2 rounded ${!isEdit ? "bg-gray-200" : "bg-white"}`}
        />

        <label className="font-medium">Website:</label>
        <input
            type="text"
            name="website"
            value={formData.website}
            onChange={handleChange}
            readOnly={!isEdit}
            className={`w-full p-2 rounded ${!isEdit ? "bg-gray-200" : "bg-white"}`}
        />

        <label className="font-medium">Address:</label>
        <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            readOnly={!isEdit}
            className={`w-full p-2 rounded ${!isEdit ? "bg-gray-200" : "bg-white"}`}
        />
    </div>
</div>


       {/* References Section */}
<div className="space-y-2">
    <h3 className="text-lg font-bold">References</h3>
    {formData.references && formData.references.length > 0 ? (
        formData.references.map((reference, index) => (
            <div key={index} className="flex flex-col bg-white p-2 rounded shadow space-y-1">
                <label className="font-medium">Name:</label>
                <input
                    type="text"
                    name="name"
                    value={reference.name}
                    onChange={(e) => handleReferenceChange(index, e)}
                    readOnly={!isEdit}
                    className={`w-full p-2 rounded ${!isEdit ? "bg-gray-200" : "bg-white"}`}
                />

                <label className="font-medium">Role:</label>
                <input
                    type="text"
                    name="role"
                    value={reference.role}
                    onChange={(e) => handleReferenceChange(index, e)}
                    readOnly={!isEdit}
                    className={`w-full p-2 rounded ${!isEdit ? "bg-gray-200" : "bg-white"}`}
                />

                <label className="font-medium">Contact:</label>
                <input
                    type="text"
                    name="contact"
                    value={reference.contact}
                    onChange={(e) => handleReferenceChange(index, e)}
                    readOnly={!isEdit}
                    className={`w-full p-2 rounded ${!isEdit ? "bg-gray-200" : "bg-white"}`}
                />

                {isEdit && (
                    <button onClick={() => removeReference(index)} className="text-red-500 hover:text-red-700">
                        Remove Reference
                    </button>
                )}
            </div>
        ))
    ) : (
        <p>No references added.</p>
    )}

    {isEdit && (
        <button onClick={addReference} className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Add Reference
        </button>
    )}
</div>


      {/* Education Section */}
<div className="space-y-2">
    <h3 className="text-lg font-bold">Education</h3>
    {education.length > 0 ? (
        education.map((edu, index) => (
            <div key={index} className="flex flex-col bg-white p-2 rounded shadow space-y-1">
                <label className="font-medium">Major:</label>
                <input
                    type="text"
                    name="major"
                    value={edu.major}
                    onChange={(e) => handleEducationChange(index, e)}
                    readOnly={!isEdit}
                    className={`w-full p-2 rounded ${!isEdit ? "bg-gray-200" : "bg-white"}`}
                />

                <label className="font-medium">University:</label>
                <input
                    type="text"
                    name="university"
                    value={edu.university}
                    onChange={(e) => handleEducationChange(index, e)}
                    readOnly={!isEdit}
                    className={`w-full p-2 rounded ${!isEdit ? "bg-gray-200" : "bg-white"}`}
                />

                <label className="font-medium">Year:</label>
                <input
                    type="text"
                    name="year"
                    value={edu.year}
                    onChange={(e) => handleEducationChange(index, e)}
                    readOnly={!isEdit}
                    className={`w-full p-2 rounded ${!isEdit ? "bg-gray-200" : "bg-white"}`}
                />

                {isEdit && (
                    <button onClick={() => removeEducation(index)} className="text-red-500 hover:text-red-700">
                        Remove
                    </button>
                )}
            </div>
        ))
    ) : (
        <p>No education records found.</p>
    )}

    {isEdit && (
        <button onClick={addEducation} className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Add Education
        </button>
    )}
</div>


      {/* Main Content */}
      <main className="w-3/4 bg-white p-8 space-y-6">
        {/* Header */}
        <header className="space-y-2">
          <h1 className="text-4xl font-bold">{formData.fullname}</h1>
          <h2 className="text-xl text-gray-600">{formData.professionalTitle}</h2>
        </header>

        {/* About Section */}
        <section>
          <h3 className="text-2xl font-bold mb-2">About Me</h3>
          <textarea
            readOnly={!isEdit}
            value={formData.personalDescription}
            onChange={handleChange}
            name="personalDescription"
            className="w-full p-2 text-gray-700"
        
          />
        </section>

       {/* Experience Section */}
<section className="space-y-4">
    <h3 className="text-2xl font-bold mb-2">Experience</h3>
    {experiences.length > 0 ? (
        experiences.map((exp, index) => (
            <div key={exp.id} className="bg-white shadow p-4 rounded-lg">
                <div className="flex justify-between">
                    <h4 className="text-xl font-semibold">{exp.title}</h4>
                    {isEdit && (
                        <button onClick={() => removeExperience(index)} className="text-red-500">
                            Remove
                        </button>
                    )}
                </div>
                <p className="text-gray-800">{exp.description}</p>
                <div className="mt-2">
                    <span className="text-gray-600">{exp.company}</span>
                    <span className="mx-2">|</span>
                    <span className="text-gray-600">{exp.year}</span>
                </div>
                {isEdit && (
                    <div className="mt-2">
                        <input
                            type="text"
                            name="title"
                            value={exp.title}
                            onChange={(e) => handleExpChange(index, e)}
                            className="p-1 rounded border-gray-300 shadow-sm w-full"
                        />
                        <textarea
                            name="description"
                            value={exp.description}
                            onChange={(e) => handleExpChange(index, e)}
                            rows="3"
                            className="p-1 mt-2 rounded border-gray-300 shadow-sm w-full"
                        />
                    </div>
                )}
            </div>
        ))
    ) : (
        <p>No experiences listed.</p>
    )}
    {isEdit && (
        <button onClick={addExperience} className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Add Experience
        </button>
    )}
</section>

        {/* Skills Section */}
<section>
    <h3 className="text-2xl font-bold mb-2">Skills</h3>
    {skills.length > 0 ? (
        skills.map((skill, index) => (
            <div key={skill.id} className="flex flex-col mb-4">
                <div className="flex justify-between items-center">
                    <span className="text-lg font-medium">{skill.name}</span>
                    {isEdit && (
                        <button onClick={() => removeSkill(index)} className="text-red-500">
                            Remove
                        </button>
                    )}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${skill.level}%` }}></div>
                </div>
                {isEdit && (
                    <input
                        type="text"
                        name="level"
                        value={skill.level}
                        onChange={(e) => handleSkillsChange(index, e)}
                        className="mt-2 p-1 w-full rounded border-gray-300 shadow-sm"
                        placeholder="Skill proficiency (0-100%)"
                    />
                )}
            </div>
        ))
    ) : (
        <p>No skills added.</p>
    )}
    {isEdit && (
        <button onClick={addSkill} className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Add Skill
        </button>
    )}
</section>


       {/* Control Buttons */}
    <div className="flex justify-end space-x-4">
      <button onClick={toggleEditable} className="p-2 bg-blue-500 text-white rounded">
        {isEdit ? "Finish Editing" : "Edit"}
      </button>
      <button onClick={saveFormData} className="p-2 bg-green-500 text-white rounded">
        Save
      </button>
      <button onClick={generatePDF} className="p-2 bg-red-500 text-white rounded">
        Download PDF
      </button>
      {/* You can add other download buttons here for different formats like PNG, JPEG, etc. */}
    </div>
  </main>
</div>
  );
};

export default Template1;
