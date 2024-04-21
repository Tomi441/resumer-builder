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

const Template5 = () => {
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
    fullname: "Karen Richards",
    professionalTitle: "Professional Title",
    personalDescription: `Lorem ipsum dolor sit, amet consectetur adipisicing elit. Alia minus est culpa id corrupti nobis ullam harum, porro veniam facilis, obcaecati nulla magnam beatae quae at eos! Qui, similique laboriosam?`,
    refererName: "Sara Taylore",
    refererRole: "Director | Company Name",
    mobile: "+91 0000-0000",
    email: "urname@gmail.com",
    website: "urwebsite.com",
    address: "your street address, ss, street, city/zip code - 1234",
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
    {
      title: "skill1",
      percentage: "75",
    },
    {
      title: "skill2",
      percentage: "75",
    },
    {
      title: "skill3",
      percentage: "75",
    },
    {
      title: "skill4",
      percentage: "75",
    },
    {
      title: "skill5",
      percentage: "75",
    },
  ]);

  const [education, setEducation] = useState([
    {
      major: "ENTER YOUR MAJOR",
      university: "Name of your university / college 2005-2009",
    },
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
          / Template5 /
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
              
{/*/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}

<div className="container mx-auto px-8 py-4" ref={resumeRef}>
      {/* Header Section */}
      <div className="border-b-2 pb-2 mb-4">
        <h1 className="text-3xl font-bold uppercase">{formData.fullname}</h1>
        <h2 className="text-xl">{formData.professionalTitle}</h2>
      </div>

      {/* Professional Experience Section */}
      <div>
        <h3 className="text-2xl font-bold uppercase mb-3">Professional Experience</h3>
        {experiences.map((exp, index) => (
          <div key={index} className="mb-4">
            {/* Experience Entries */}
            {/* Editable inputs and delete button with the option to add more entries */}
          </div>
        ))}
        {/* Button to add an experience entry */}
      </div>

      {/* Education Section */}
      <div>
        <h3 className="text-2xl font-bold uppercase mb-3">Education</h3>
        {education.map((edu, index) => (
          <div key={index} className="mb-4">
            {/* Education Entries */}
            {/* Editable inputs and delete button with the option to add more entries */}
          </div>
        ))}
        {/* Button to add an education entry */}
      </div>

      {/* Skills Section */}
      <div>
        <h3 className="text-2xl font-bold uppercase mb-3">Skills</h3>
        {skills.map((skill, index) => (
          <div key={index} className="flex justify-between items-center mb-2">
            {/* Skill Entries */}
            {/* Editable inputs and delete button with the option to add more entries */}
          </div>
        ))}
        {/* Button to add a skill entry */}
      </div>

      {/* Additional Sections ... */}
             </div>
           </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Template5;
