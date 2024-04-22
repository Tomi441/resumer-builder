import React, { useEffect, useRef, useState } from "react";
import { TemplateOne } from "../assets";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  // FaFilePdf,
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
import { db } from "../config/firebase.config";
import { getTemplateDetailEditByUser } from "../api";
import MainSpinner from "../components/MainSpinner";
import jsPDF from "jspdf";
import userIcon from "../assets/svg/userIcon.svg";
import usersIcon from "../assets/svg/usersIcon.svg";
import phoneIcon from "../assets/svg/phoneIcon.svg";
import globeIcon from "../assets/svg/globeIcon.svg";
import locationIcon from "../assets/svg/locationIcon.svg";
import jobIcon from "../assets/svg/jobIcon.svg";
import chartIcon from "../assets/svg/chartIcon.svg";
import scholarIcon from "../assets/svg/schorlarIcon.svg";
// import userIcon from "../assets/svg/userIcon.svg"

import * as htmlToImage from "html-to-image";
// import {
//   deleteObject,
//   getDownloadURL,
//   ref,
//   uploadBytesResumable,
// } from "firebase/storage";
// import { PuffLoader } from "react-spinners";

const Template1 = () => {
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
    firstName: "Brian",
    middleName: "R",
    lastName: "Daxter",
    professionalTitle: "GRAPHICS & WEB DESIGNER",
    personalDescription: `Lorem ipsum dolor sit, amet consectetur adipisicing elit. Alia minus est culpa id corrupti nobis ullam harum, porro veniam facilis, obcaecati nulla magnam beatae quae at eos! Qui, similique laboriosam?`,
    refererName: "Darwin B. Magana",
    refererName2: "Robert J. Belvin",
    refererAddress: "2813 Shobe Lane Mancos, CO",
    refererTel: "Tel: +1-970-533-3393",
    refererEmail: "Email: www.yourwebsite.com",
    refererAddress2: "2119 FairFax Drive Newwark, NJ",
    refererTel2: "Tel: +1-908-987-5103",
    refererEmail2: "Email: www.yourwebsite.com",
    mobile1: "+1-718-310-5588",
    mobile2: "+1-313-381-8167",
    email: "yourname@gmail.com",
    website: "yourwebsite.com",
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
      university: "STAMFORD UNIVERSITY",
      degree: "MASTER DEGREE GRADUATE",
      year: "2011 - 2013",
    },

    {
      university: "STAMFORD UNIVERSITY",
      degree: "MASTER DEGREE GRADUATE",
      year: "2011 - 2013",
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

  const handleChange = (e, fieldName) => {
    const { name, value } = e.target;
    const nameValue = e.target.textContent;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      [fieldName]: nameValue,
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
          / Template1 /
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
            <div className="col-span-4 bg-[#353335] p-4 flex flex-col items-center space-y-6">
              <div className="w-full h-60 flex items-center justify-center">
                {!imageAsset.imageURL ? (
                  <React.Fragment>
                    <label className=" w-full cursor-pointer h-full">
                      <div className="w-full flex flex-col items-center justify-center h-full">
                        <div className="w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-white shadow-lg">
                          <img
                            src={TemplateOne}
                            className="object-cover w-full h-full"
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
                  <div className="w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <img
                      src={imageAsset.imageURL}
                      alt="uploaded_image"
                      className="object-cover w-full h-full"
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
              {/*/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}
              <div className="border-l-[1px] border-[white] w-full flex flex-col items-center justify-start pl-8 mt-4">
                <div className="w-full">
                  <div className="flex">
                    <img src={userIcon} alt="user" />
                    <p className="uppercase text-lg font-semibold text-gray-100 ml-2">
                      Contact Me
                    </p>
                  </div>
                </div>
                {/* Phone */}
                <div className="flex mt-[5%]">
                  <img src={phoneIcon} alt="user" />
                  <div>
                    <input
                      value={formData.mobile1}
                      onChange={handleChange}
                      name="mobile1"
                      type="text"
                      readOnly="true"
                      className={`bg-transparent outline-none border-none text-xs px-3 mt-2 text-gray-200 w-full ${
                        isEdit && "bg-[#1c1c1c]"
                      }`}
                    />
                    <input
                      value={formData.mobile2}
                      onChange={handleChange}
                      name="mobile2"
                      type="text"
                      readOnly="true"
                      className={`bg-transparent outline-none border-none text-xs px-3 text-gray-200 w-full ${
                        isEdit && "bg-[#1c1c1c]"
                      }`}
                    />
                  </div>
                </div>

                {/* website and Email */}
                <div className="flex mt-[2%]">
                  <img src={globeIcon} alt="user" />
                  <div>
                    <input
                      value={formData.website}
                      onChange={handleChange}
                      name="website"
                      type="text"
                      readOnly="true"
                      className={`bg-transparent outline-none border-none text-xs px-3 mt-2 text-gray-200 w-full ${
                        isEdit && "bg-[#1c1c1c]"
                      }`}
                    />
                    <input
                      value={formData.email}
                      onChange={handleChange}
                      name="email"
                      type="text"
                      readOnly="true"
                      className={`bg-transparent outline-none border-none text-xs px-3 text-gray-200 w-full ${
                        isEdit && "bg-[#1c1c1c]"
                      }`}
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="flex mt-[2%] w-[100%]">
                  <img src={locationIcon} alt="user" />

                  <textarea
                    readOnly="true"
                    className={`text-xs text-gray-200 mt-2 px-3  w-full  outline-none border-none ${
                      isEdit ? "bg-[#1c1c1c]" : "bg-transparent"
                    }`}
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="2"
                    style={{
                      maxHeight: "auto",
                      minHeight: "40px",
                      resize: "none",
                    }}
                  />
                </div>

                <div className="col-span-3 w-full border-dashed border-[1px] border-[#ffffff] my-[10%]"></div>

                {/* reference */}
                <div className="w-full">
                  <div className="flex">
                    <img src={usersIcon} alt="" />
                    <p className="ml-3 uppercase text-lg font-semibold text-gray-100">
                      Reference
                    </p>
                  </div>

                  <div className="w-full mt-3">
                    <input
                      value={formData.refererName}
                      onChange={handleChange}
                      name="refererName"
                      type="text"
                      readOnly="true"
                      className={`bg-transparent outline-none font-semibold border-none text-base tracking-widest capitalize text-gray-100 w-full ${
                        isEdit && "bg-[#1c1c1c]"
                      }`}
                    />

                    <input
                      value={formData.refererAddress}
                      onChange={handleChange}
                      name="refererAddress"
                      type="text"
                      readOnly="true"
                      className={`bg-transparent outline-none border-none text-xs capitalize text-gray-300 w-full ${
                        isEdit && "bg-[#1c1c1c]"
                      }`}
                    />

                    <input
                      value={formData.refererTel}
                      onChange={handleChange}
                      name="referPhone"
                      type="text"
                      readOnly="true"
                      className={`bg-transparent outline-none border-none text-xs capitalize text-gray-300 w-full ${
                        isEdit && "bg-[#1c1c1c]"
                      }`}
                    />

                    <input
                      value={formData.refererEmail}
                      onChange={handleChange}
                      name="refererEmail"
                      type="text"
                      readOnly="true"
                      className={`bg-transparent outline-none border-none text-xs capitalize text-gray-300 w-full ${
                        isEdit && "bg-[#1c1c1c]"
                      }`}
                    />
                  </div>

                  <div className="w-full mt-3">
                    <input
                      value={formData.refererName2}
                      onChange={handleChange}
                      name="refererName"
                      type="text"
                      readOnly="true"
                      className={`bg-transparent outline-none font-semibold border-none text-base tracking-widest capitalize text-gray-100 w-full ${
                        isEdit && "bg-[#1c1c1c]"
                      }`}
                    />

                    <input
                      value={formData.refererAddress2}
                      onChange={handleChange}
                      name="refererAddress"
                      type="text"
                      readOnly="true"
                      className={`bg-transparent outline-none border-none text-xs capitalize text-gray-300 w-full ${
                        isEdit && "bg-[#1c1c1c]"
                      }`}
                    />

                    <input
                      value={formData.refererTel2}
                      onChange={handleChange}
                      name="referPhone"
                      type="text"
                      readOnly="true"
                      className={`bg-transparent outline-none border-none text-xs capitalize text-gray-300 w-full ${
                        isEdit && "bg-[#1c1c1c]"
                      }`}
                    />

                    <input
                      value={formData.refererEmail2}
                      onChange={handleChange}
                      name="refererEmail"
                      type="text"
                      readOnly="true"
                      className={`bg-transparent outline-none border-none text-xs capitalize text-gray-300 w-full ${
                        isEdit && "bg-[#1c1c1c]"
                      }`}
                    />
                  </div>
                </div>

                <div className="col-span-3 w-full border-dashed border-[1px] border-[#ffffff] my-[10%]"></div>

                {/* {Education} */}
                <div className="w-full flex flex-col items-center justify-start mt-4 gap-6">
                  <div className="w-full">
                    <p className="uppercase text-lg font-semibold text-gray-100">
                      Education
                    </p>

                    <AnimatePresence>
                      {education &&
                        education?.map((edu, i) => (
                          <motion.div
                            key={i}
                            {...opacityINOut(i)}
                            className="w-full mt-5 relative"
                          >
                            <input
                              type="text"
                              readOnly="true"
                              name="university"
                              value={edu.university}
                              onChange={(e) => handleEducationChange(i, e)}
                              className={`bg-transparent outline-none border-none text-sm font-semibold uppercase  text-gray-100  ${
                                isEdit && "text-yellow-400 w-full"
                              }`}
                            />

                            <textarea
                              readOnly="true"
                              className={`text-xs text-gray-200 mt-2  w-full  outline-none border-none ${
                                isEdit ? "bg-[#1c1c1c]" : "bg-transparent"
                              }`}
                              name="degree"
                              value={edu.degree}
                              onChange={(e) => handleEducationChange(i, e)}
                              rows="1"
                              style={{
                                maxHeight: "auto",
                                minHeight: "10px",
                                resize: "none",
                              }}
                            />
                            <input
                              type="text"
                              readOnly="true"
                              name="year"
                              value={edu.year}
                              onChange={(e) => handleEducationChange(i, e)}
                              className={`bg-transparent mt-0 outline-none border-none text-[12px] font-light uppercase  text-gray-100  ${
                                isEdit && "text-yellow-400 w-full"
                              }`}
                            />

                            <AnimatePresence>
                              {isEdit && (
                                <motion.div
                                  {...FadeInOutWithOpacityAlone}
                                  onClick={() => removeEducation(i)}
                                  className="cursor-pointer absolute right-2 top-0"
                                >
                                  <FaTrash className="text-sm text-gray-100" />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        ))}
                    </AnimatePresence>
                  </div>

                  <AnimatePresence>
                    {isEdit && (
                      <motion.div
                        {...FadeInOutWithOpacityAlone}
                        onClick={addEducation}
                        className="cursor-pointer"
                      >
                        <FaPlus className="text-base text-gray-100" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="col-span-8 flex flex-col items-center justify-start py-6 bg-white">
              <div className="w-full py-6"></div>

              {/* title */}
              <div className="w-full px-8 py-6 bg-[#F1EFF2]">
                <div className="flex items-center justify-start ">
                  <div className="bg-transparent outline-none border-none text-3xl font-sans uppercase tracking-wider font-extrabold">
                    <span
                      contentEditable
                      onBlur={(e) => handleChange(e, "firstName")}
                      suppressContentEditableWarning={true}
                    >
                      {formData.firstName}
                    </span>{" "}
                    <span
                      contentEditable
                      onBlur={(e) => handleChange(e, "middleName")}
                      suppressContentEditableWarning={true}
                    >
                      {formData.middleName}
                    </span>{" "}
                    <span
                      className="text-[#E9AE20]"
                      contentEditable
                      onBlur={(e) => handleChange(e, "lastName")}
                      suppressContentEditableWarning={true}
                    >
                      {formData.lastName}
                    </span>
                  </div>

                  {/* <input
                    type="text"
                    readOnly="true"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    className={`bg-transparent outline-none border-none text-3xl font-sans uppercase tracking-wider text-txtDark font-extrabold ${
                      isEdit && "text-white w-full"
                    }`}
                  /> */}
                </div>

                <input
                  value={formData.professionalTitle}
                  onChange={handleChange}
                  name="professionalTitle"
                  type="text"
                  readOnly="true"
                  className={`bg-transparent mt-2 outline-none border-none text-xl tracking-widest uppercase text-txtPrimary w-full ${
                    isEdit && "text-white"
                  }`}
                />
              </div>

              {/* about me */}
              <div className="w-full px-8 py-6 flex flex-col items-start justify-start gap-6">
                <div className="w-full">
                  <div className="flex mt-[5%]">
                    <img src={scholarIcon} alt="" />
                    <p className="ml-3 font-semibold uppercase text-xl tracking-wider">
                      About Me
                    </p>
                  </div>
                  <textarea
                    readOnly="true"
                    className={`text-base mt-[3%] text-[#777777] tracking-wider w-full  outline-none border-none ${
                      isEdit ? "bg-gray-200" : "bg-transparent"
                    }`}
                    name="personalDescription"
                    value={formData.personalDescription}
                    onChange={handleChange}
                    rows="4"
                    style={{
                      minHeight: "100px",
                      width: "100%",
                      height: "100px",
                      resize: "none",
                    }}
                  />
                </div>

                {/* experience */}
                <div className="w-full">
                  <div className="flex">
                    <img src={jobIcon} alt="" />
                    <p className="ml-3 uppercase text-xl tracking-wider font-semibold">
                      Job Experience
                    </p>
                  </div>

                  <div className="w-full mt-5 flex flex-col items-center justify-start">
                    <AnimatePresence>
                      {experiences &&
                        experiences?.map((exp, i) => (
                          <motion.div
                            {...opacityINOut(i)}
                            className="flex justify-between w-[100%]"
                            key={i}
                          >
                            <div className="w-[85%] relative">
                              <AnimatePresence>
                                {isEdit && (
                                  <motion.div
                                    {...FadeInOutWithOpacityAlone}
                                    onClick={() => removeExperience(i)}
                                    className="cursor-pointer absolute right-0 top-2"
                                  >
                                    <FaTrash className="text-base text-black" />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                              <input
                                value={exp.title}
                                onChange={(e) => handleExpChange(i, e)}
                                name="title"
                                type="text"
                                readOnly="true"
                                className={` outline-none border-none font-sans font-semibold text-lg tracking-wide capitalize text-black w-full ${
                                  isEdit ? "bg-gray-200" : "bg-transparent"
                                }`}
                              />

                              <input
                                value={exp.companyAndLocation}
                                onChange={(e) => handleExpChange(i, e)}
                                name="companyAndLocation"
                                type="text"
                                readOnly="true"
                                className={` outline-none border-none text-sm tracking-wide capitalize text-txtPrimary w-full ${
                                  isEdit ? "bg-gray-200" : "bg-transparent"
                                }`}
                              />

                              <textarea
                                readOnly="true"
                                className={`text-xs mt-4  text-txtPrimary tracking-wider w-full  outline-none border-none ${
                                  isEdit ? "bg-gray-200" : "bg-transparent"
                                }`}
                                name="description"
                                value={exp.description}
                                onChange={(e) => handleExpChange(i, e)}
                                rows="3"
                                style={{
                                  maxHeight: "auto",
                                  minHeight: "50px",
                                  resize: "none",
                                }}
                              />
                            </div>

                            <div className="w-[15%]">
                              <input
                                value={exp.year}
                                onChange={(e) => handleExpChange(i, e)}
                                name="year"
                                type="text"
                                readOnly="true"
                                className={` outline-none border-none text-[12px] text-base tracking-eide uppercase text-black w-full ${
                                  isEdit ? "bg-gray-200" : "bg-transparent"
                                }`}
                              />
                            </div>
                          </motion.div>
                        ))}
                    </AnimatePresence>
                    <AnimatePresence>
                      {isEdit && (
                        <motion.div
                          {...FadeInOutWithOpacityAlone}
                          onClick={addExperience}
                          className="cursor-pointer"
                        >
                          <FaPlus className="text-base text-txtPrimary" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* skills */}
                <div className="w-full">
                  <div className="flex">
                    <img src={chartIcon} alt="" />
                    <p className="ml-3 text-semibold uppercase text-xl tracking-wider">
                      Skills
                    </p>
                  </div>

                  <div className="w-full mt-3 flex flex-wrap items-center justify-start gap-4">
                    <AnimatePresence>
                      {skills &&
                        skills?.map((skill, i) => (
                          <motion.div
                            key={i}
                            {...opacityINOut(i)}
                            className="flex-1"
                            style={{ minWidth: 225 }}
                          >
                            <div className="w-full flex items-center justify-between">
                              <div className="flex items-center justify-center">
                                <input
                                  value={skill.title}
                                  onChange={(e) => handleSkillsChange(i, e)}
                                  name="title"
                                  type="text"
                                  readOnly="true"
                                  className={` outline-none border-none text-base tracking-wide capitalize font-semibold text-txtPrimary w-full ${
                                    isEdit ? "bg-gray-200" : "bg-transparent"
                                  }`}
                                />

                                <AnimatePresence>
                                  {isEdit && (
                                    <motion.input
                                      {...FadeInOutWithOpacityAlone}
                                      value={skill.percentage}
                                      onChange={(e) => handleSkillsChange(i, e)}
                                      name="percentage"
                                      type="text"
                                      className={` outline-none border-none text-base tracking-wide capitalize font-semibold text-txtPrimary w-full ${
                                        isEdit
                                          ? "bg-gray-200"
                                          : "bg-transparent"
                                      }`}
                                    />
                                  )}
                                </AnimatePresence>
                              </div>

                              <AnimatePresence>
                                {isEdit && (
                                  <motion.div
                                    {...FadeInOutWithOpacityAlone}
                                    onClick={() => removeSkill(i)}
                                    className="cursor-pointer "
                                  >
                                    <FaTrash className="text-base text-txtPrimary" />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                            <div className="relative mt-2 w-full h-1 rounded-md bg-gray-400">
                              <div
                                className="h-full rounded-md bg-[#F3AA03]"
                                style={{
                                  width: `${skill.percentage}%`,
                                  transition: "width 0.3s ease",
                                }}
                              ></div>
                            </div>
                          </motion.div>
                        ))}
                    </AnimatePresence>
                  </div>
                  <AnimatePresence>
                    {isEdit && (
                      <div className="w-full  flex items-center justify-center py-4">
                        <motion.div
                          {...FadeInOutWithOpacityAlone}
                          onClick={addSkill}
                          className="cursor-pointer"
                        >
                          <FaPlus className="text-base text-txtPrimary" />
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Template1;
