import React, { useEffect, useRef, useState } from "react";
import { TemplateOne } from "../assets";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaFilePdf,
  FaHouse,
  FaPenToSquare,
  FaPencil,
  FaPlus,
  FaTrash,
} from "react-icons/fa6";

import { BiSolidBookmarks } from "react-icons/bi";
import {
  BsFiletypeJpg,
  BsFiletypePdf,
  BsFiletypePng,
  BsFiletypeSvg,
} from "react-icons/bs";
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
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { PuffLoader } from "react-spinners";
import { FaPhone, FaEnvelope, FaGlobe, FaMapMarkerAlt, FaLanguage, FaChessKnight } from 'react-icons/fa';
import { IoIosPeople } from 'react-icons/io';
import { GiChessKnight } from 'react-icons/gi';


const Template2 = () => {
  const { pathname } = useLocation();
  const location = useLocation();
  const navigate = useNavigate();
  const templateName = pathname?.split("/")?.slice(-1);
  const searchParams = new URLSearchParams(location.search);
  const loadedTemplateId = searchParams.get("templateId");
  // console.log(pathname, templateName, loadedTemplateId);

  const [isEdit, setIsEdit] = useState(false);
  const { data: user } = useUser();

  const resumeRef = useRef(null);

  const [imageAsset, setImageAsset] = useState({
    isImageLoading: false,
    imageURL: null,
  });

  const {
    data: resumeData,
    isLoading: resume_isLoading,
    isError: resume_isError,
    refetch: refetch_resumeData,
  } = useQuery(["templateEditedByUser", `${templateName}-${user?.uid}`], () =>
    getTemplateDetailEditByUser(user?.uid, `${templateName}-${user?.uid}`)
  );

  const [formData, setFormData] = useState({
    fullname: 'Noel Taylor',
    professionalTitle: 'Graphic & Web Designer',
    personalDescription: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry...',
    // ... other existing form fields
  });
  

  const [experiences, setExperiences] = useState([
    {
      year: "2012 - 2014",
      title: "Job Position Here",
      companyAndLocation: "Company Name / Location here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis voluptatibus minima tenetur nostrum quo aliquam dolorum incidunt.",
    },
    {
      year: "2012 - 2014",
      title: "Job Position Here",
      companyAndLocation: "Company Name / Location here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis voluptatibus minima tenetur nostrum quo aliquam dolorum incidunt.",
    },
    {
      year: "2012 - 2014",
      title: "Job Position Here",
      companyAndLocation: "Company Name / Location here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis voluptatibus minima tenetur nostrum quo aliquam dolorum incidunt.",
    },
  ]);

  const [skills, setSkills] = useState([
    { skill: 'Adobe Photoshop', level: 90 },
    { skill: 'Adobe Illustrator', level: 85 },
    { skill: 'Microsoft Word', level: 80 },
    { skill: 'Microsoft Powerpoint', level: 75 },
    { skill: 'HTML/CSS/JS', level: 95 }
    // ... add more if needed
  ]);
  

  const [education, setEducation] = useState([
    {
      major: "ENTER YOUR MAJOR",
      university: "Name of your university / college 2005-2009",
    },
  ]);

  const [languages, setLanguages] = useState([
    'English', 'Spanish', 'French', 'German'
    // ... add more if needed
  ]);
  
  const [hobbies, setHobbies] = useState([
    'Reading Books', 'Traveling', 'Playing Chess'
    // ... add more if needed
  ]);
  
  
const [references, setReferences] = useState([
  {
    name: 'Darwin B. Magana',
    contact: '2813 Shobe Lane Mancos, CO',
    phone: '+1-970-533-3393',
    email: 'contact@website.com'
  },
  {
    name: 'Robert J. Blevin',
    contact: '2119 Fairfax Drive Newark, NJ',
    phone: '+1-908-987-5103',
    email: 'contact@website.com'
  }
  // ... add more if needed
]);

  useEffect(() => {
    if (resumeData?.formData) {
      setFormData({ ...resumeData?.formData });
    }
    if (resumeData?.experiences) {
      setExperiences(resumeData?.experiences);
    }
    if (resumeData?.skills) {
      setSkills(resumeData?.skills);
    }
    if (resumeData?.education) {
      setEducation(resumeData?.education);
    }
    if (resumeData?.references) {
      setReferences(resumeData?.references);
    }
    if (resumeData?.languages) {
      setLanguages(resumeData?.languages);
    }
    if (resumeData?.hobbies) {
      setHobbies(resumeData?.hobbies);
    }
    if (resumeData?.userProfilePic) {
      setImageAsset((prevAsset) => ({
        ...prevAsset,
        imageURL: resumeData?.userProfilePic,
      }));
    }
  }, [resumeData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const toggleEditable = () => {
    setIsEdit(!isEdit);
    var inputs = document.querySelectorAll("input");
    var textarea = document.querySelectorAll("textarea");

    for (var i = 0; i < inputs.length; i++) {
      inputs[i].readOnly = !inputs[i].readOnly;
    }

    for (var i = 0; i < textarea.length; i++) {
      textarea[i].readOnly = !textarea[i].readOnly;
    }
  };

  // image upload to the cloud
  const handleFileSelect = async (event) => {
    setImageAsset((prevAsset) => ({ ...prevAsset, isImageLoading: true }));
    // console.log(event.target.files[0]);
    const file = event.target.files[0];
    if (file && isAllowed(file)) {
      const reader = new FileReader();

      reader.onload = function (event) {
        const dataURL = event.target.result;
        console.log("Data URL:", dataURL);

        // You can now use the dataURL as needed, e.g., to display an image.
        setImageAsset((prevAsset) => ({
          ...prevAsset,
          imageURL: dataURL,
        }));
      };

      // Read the file as a Data URL
      reader.readAsDataURL(file);
    } else {
      toast.error("Invalid File Format");
    }
  };

  const isAllowed = (file) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    return allowedTypes.includes(file.type);
  };

  // delete an image
  const deleteImageObject = () => {
    setImageAsset((prevAsset) => ({
      ...prevAsset,
      imageURL: null,
    }));
  };

  // uploader finshed

  const handleExpChange = (index, e) => {
    const { name, value } = e.target;
    // Create a copy of the workExperiences array
    const updatedExperiences = [...experiences];
    // Update the specific field for the experience at the given index
    updatedExperiences[index][name] = value;
    // Update the state with the modified array
    setExperiences(updatedExperiences);
  };

  const removeExperience = (index) => {
    // Create a copy of the workExperiences array and remove the experience at the given index
    const updatedExperiences = [...experiences];
    updatedExperiences.splice(index, 1);
    // Update the state with the modified array
    setExperiences(updatedExperiences);
  };

  const addExperience = () => {
    // Create a copy of the workExperiences array and add a new experience
    const updatedExperiences = [
      ...experiences,
      {
        year: "2012 - 2014",
        title: "Job Position Here",
        companyAndLocation: "Company Name / Location here",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis voluptatibus minima tenetur nostrum quo aliquam dolorum incidunt.",
      },
    ];
    // Update the state with the modified array
    setExperiences(updatedExperiences);
  };

  const handleSkillsChange = (index, e) => {
    const { name, value } = e.target;
    const updatedSkills = [...skills];
    updatedSkills[index][name] = value;
    setSkills(updatedSkills);
  };

  const removeSkill = (index) => {
    const updatedSkills = [...skills];
    updatedSkills.splice(index, 1);
    setSkills(updatedSkills);
  };

  const addSkill = () => {
    const updatedSkills = [
      ...skills,
      {
        title: "skill1",
        percentage: "75",
      },
    ];
    setSkills(updatedSkills);
  };

  const handleEducationChange = (index, e) => {
    const { name, value } = e.target;
    const updatedEdu = [...education];
    updatedEdu[index][name] = value;
    setEducation(updatedEdu);
  };

  const removeEducation = (index) => {
    const updatedEdu = [...education];
    updatedEdu.splice(index, 1);
    setEducation(updatedEdu);
  };

  const addEducation = () => {
    const updatedEdu = [
      ...education,
      {
        major: "ENTER YOUR MAJOR",
        university: "Name of your university / college 2005-2009",
      },
    ];
    setEducation(updatedEdu);
  };

  const handleLanguageChange = (index, newLanguage) => {
    const updatedLanguages = [...languages];
    updatedLanguages[index] = newLanguage;
    setLanguages(updatedLanguages);
  };
  
  // Handler to remove a language
  const removeLanguage = (index) => {
    const updatedLanguages = [...languages];
    updatedLanguages.splice(index, 1);
    setLanguages(updatedLanguages);
  };
  
  // Handler to add a new language
  const addLanguage = () => {
    setLanguages([...languages, '']);
  };
  
  // Handler to update hobbies
  const handleHobbyChange = (index, newHobby) => {
    const updatedHobbies = [...hobbies];
    updatedHobbies[index] = newHobby;
    setHobbies(updatedHobbies);
  };
  
  // Handler to remove a hobby
  const removeHobby = (index) => {
    const updatedHobbies = [...hobbies];
    updatedHobbies.splice(index, 1);
    setHobbies(updatedHobbies);
  };
  
  // Handler to add a new hobby
  const addHobby = () => {
    setHobbies([...hobbies, '']);
  };
  
  // Handler to update reference details
  const handleReferenceChange = (index, e) => {
    const { name, value } = e.target;
    const updatedReferences = [...references];
    updatedReferences[index][name] = value;
    setReferences(updatedReferences);
  };
  
  // Handler to remove a reference
  const removeReference = (index) => {
    const updatedReferences = [...references];
    updatedReferences.splice(index, 1);
    setReferences(updatedReferences);
  };
  
  // Handler to add a new reference
  const addReference = () => {
    setReferences([...references, { name: '', contact: '', phone: '', email: '' }]);
  };
  

  const saveFormData = async () => {
    const timeStamp = serverTimestamp();
    const resume_id = `${templateName}-${user?.uid}`;
    const imageURL = await getImage();
    const _doc = {
      _id: loadedTemplateId,
      resume_id,
      formData,
      education,
      experiences,
      skills,
      references,
      languages,
      hobbies,
      timeStamp,
      userProfilePic: imageAsset.imageURL,
      imageURL,
    };
    console.log(_doc);
    setDoc(doc(db, "users", user?.uid, "resumes", resume_id), _doc)
      .then(() => {
        toast.success(`Data Saved`);
        refetch_resumeData();
      })
      .catch((err) => {
        toast.error(`Error : ${err.message}`);
      });
  };

  const generatePDF = async () => {
    // Access the DOM element using the useRef reference.
    const element = resumeRef.current;

    if (!element) {
      console.error("Unable to capture content. The DOM element is null.");
      return;
    }

    htmlToImage
      .toPng(element)
      .then(function (dataUrl) {
        const a4Width = 210;
        const a4Height = 297;
        var pdf = new jsPDF({
          orientation: "p",
          unit: "mm",
          format: [a4Width, a4Height],
        });

        const aspectRatio = a4Width / a4Height;
        const imgWidth = a4Width;
        const imgHeight = a4Width / aspectRatio;

        const verticalMargin = (a4Height - imgHeight) / 2;

        pdf.addImage(dataUrl, "PNG", 0, verticalMargin, imgWidth, imgHeight);

        pdf.save("resume.pdf");
      })
      .catch(function (error) {
        console.error("oops, something went wrong!", error);
      });
  };

  const getImage = async () => {
    const element = resumeRef.current;
    element.onload = async () => {
      // Call the image capture code here
    };
    element.onerror = (error) => {
      console.error("Image loading error:", error);
    };
    if (!element) {
      console.error("Unable to capture content. The DOM element is null.");
      return;
    }
    try {
      const dataUrl = await htmlToImage.toJpeg(element);
      console.log(dataUrl);
      return dataUrl;
    } catch (error) {
      console.error("Oops, something went wrong!", error.message);
      return null; // Return a default value or handle the error appropriately
    }
  };

  const generateImage = async () => {
    const element = resumeRef.current;
    if (!element) {
      console.error("Unable to capture content. The DOM element is null.");
      return;
    }
    htmlToImage
      .toJpeg(element)
      .then(function (dataUrl) {
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = "resume.jpg";
        a.click();
      })
      .catch(function (error) {
        console.error("Oops, something went wrong!", error);
      });
  };

  const generatePng = async () => {
    const element = resumeRef.current;
    if (!element) {
      console.error("Unable to capture content. The DOM element is null.");
      return;
    }
    htmlToImage
      .toPng(element)
      .then(function (dataUrl) {
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = "resume.png";
        a.click();
      })
      .catch(function (error) {
        console.error("Oops, something went wrong!", error);
      });
  };

  const generateSvg = async () => {
    const element = resumeRef.current;
    if (!element) {
      console.error("Unable to capture content. The DOM element is null.");
      return;
    }
    htmlToImage
      .toSvg(element)
      .then(function (dataUrl) {
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = "resume.svg";
        a.click();
      })
      .catch(function (error) {
        console.error("Oops, something went wrong!", error);
      });
  };

  if (resume_isLoading) return <MainSpinner />;

  if (resume_isError) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center">
        <p className="text-lg text-txtPrimary font-semibold">
          Error While fetching the data
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-start gap-4">
      {/* bread crump */}
      <div className="w-full flex items-center gap-2 px-4">
        <Link
          to={"/"}
          className="flex items-center justify-center gap-2 text-txtPrimary"
        >
          <FaHouse />
          Home
        </Link>
        <p
          className="text-txtPrimary cursor-pointer"
          onClick={() => navigate(-1)}
        >
          / Template2 /
        </p>
        <p>Edit</p>
      </div>

      <div className="w-full lg:w-[1200px] grid grid-cols-1 lg:grid-cols-12 px-6 lg:px-32">
        {/* template design */}
        <div className="col-span-12 px-4 py-6">
          <div className="flex items-center justify-end w-full gap-12 mb-4">
            <div
              className="flex items-center justify-center gap-1 px-3 py-1 rounded-md bg-gray-200 cursor-pointer"
              onClick={toggleEditable}
            >
              {isEdit ? (
                <FaPenToSquare className="text-sm text-txtPrimary" />
              ) : (
                <FaPencil className="text-sm text-txtPrimary" />
              )}
              <p className="text-sm text-txtPrimary">Edit</p>
            </div>

            <div
              className="flex items-center justify-center gap-1 px-3 py-1 rounded-md bg-gray-200 cursor-pointer"
              onClick={saveFormData}
            >
              <BiSolidBookmarks className="text-sm text-txtPrimary" />
              <p className="text-sm text-txtPrimary">Save</p>
            </div>

            <div className=" flex items-center justify-center gap-2">
              <p className="text-sm text-txtPrimary">Download : </p>
              <BsFiletypePdf
                className="text-2xl text-txtPrimary cursor-pointer"
                onClick={generatePDF}
              />
              <BsFiletypePng
                onClick={generatePng}
                className="text-2xl text-txtPrimary cursor-pointer"
              />
              <BsFiletypeJpg
                className="text-2xl text-txtPrimary cursor-pointer"
                onClick={generateImage}
              />
              <BsFiletypeSvg
                onClick={generateSvg}
                className="text-2xl text-txtPrimary cursor-pointer"
              />
            </div>
          </div>
          <div className="w-full h-auto grid grid-cols-12" ref={resumeRef}>
            <div className="col-span-4 bg-black flex flex-col items-center justify-start">
              <div className="w-full h-80 bg-gray-300 flex items-center justify-center">
                {!imageAsset.imageURL ? (
                  <React.Fragment>
                    <label className=" w-full cursor-pointer h-full">
                      <div className="w-full flex flex-col items-center justify-center h-full">
                        <div className="w-full flex flex-col justify-center items-center cursor-pointer">
                          <img
                            src={TemplateOne}
                            className="rounded-full w-32 h-32 object-cover"
                            alt=""
                          />
                        </div>
                      </div>

                      {isEdit && (
                        <input
                          type="file"
                          className="w-0 h-0"
                          accept=".jpeg,.jpg,.png"
                          onChange={handleFileSelect}
                        />
                      )}
                    </label>
                  </React.Fragment>
                ) : (
                  <div className="relative w-full h-full overflow-hidden rounded-md">
                    <img
                      src={imageAsset.imageURL}
                      alt="uploaded image"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />

                    {isEdit && (
                      <div
                        className="absolute top-4 right-4 w-8 h-8 rounded-md flex items-center justify-center bg-red-500 cursor-pointer"
                        onClick={deleteImageObject}
                      >
                        <FaTrash className="text-sm text-white" />
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="w-full flex flex-col lg:flex-row justify-center lg:items-start bg-white shadow-md">
        {/* Left Column with teal background */}
        <div className="w-full lg:w-1/3 bg-teal-500 text-white p-4">
          {/*  Contact, and Education sections */}
          

          {/* Contact Section */}
          <div className="mt-4">
            <FaPhone />
            <span>{formData.phone}</span>
          </div>

          <div>
            <FaEnvelope />
            <span>{formData.email}</span>
          </div>

          <div>
            <FaGlobe />
            <span>{formData.website}</span>
          </div>

          <div>
            <FaMapMarkerAlt />
            <span>{formData.address}</span>
          </div>

          {/* Education Section */}
<div className="mt-4 space-y-3">
  <h3 className="text-lg font-bold text-white">Education</h3>
  {education.map((edu, index) => (
    <div key={index} className="bg-white p-2 rounded shadow space-y-1">
      <div className="text-teal-800 font-semibold">{edu.degree}</div>
      <div className="text-sm text-teal-600">{edu.field}</div>
      <div className="text-xs">{edu.school}</div>
      <div className="text-xs">{edu.year}</div>
    </div>
  ))}
</div>


          {/* References Section */}
          <div className="mt-4">
            {/* Map through references state and display */}
          </div>
        </div>

        {/* Right Column with white background */}
        <div className="w-full lg:w-2/3 bg-white p-4">
          {/* About, Experience, and Skills sections */}
          {/* About Me Section */}
          <div className="mt-4">
            <h2 className="text-xl font-bold">ABOUT ME</h2>
            <p>{formData.personalDescription}</p>
          </div>

          {/* Experience Section */}
          <div className="mt-4">
            {/* Map through experiences state and display */}
          </div>

          {/* Skills Section */}
          <div className="mt-4">
            {/* Map through skills state and display */}
          </div>

          {/* Languages and Hobbies Section */}
          <div className="flex mt-4">
            <div>
              <FaLanguage />
              <ul>
                {/* Map through languages state and display */}
              </ul>
            </div>
            <div>
              
              <ul>
                {/* Map through hobbies state and display */}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer section for additional controls if necessary */}
    </div>
  
              
                  
              
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Template2;
