import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
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
import * as htmlToImage from "html-to-image";

const Template4 = () => {
  const { pathname } = useLocation();
  const location = useLocation();
  const navigate = useNavigate();
  const templateName = pathname?.split("/")?.slice(-1);
  const searchParams = new URLSearchParams(location.search);
  const loadedTemplateId = searchParams.get("templateId");
  const [isEdit, setIsEdit] = useState(false);
  const { data: user } = useUser();
  const resumeRef = useRef(null);

  const {
    data: resumeData,
    isLoading: resume_isLoading,
    isError: resume_isError,
    refetch: refetch_resumeData,
  } = useQuery(["templateEditedByUser", `${templateName}-${user?.uid}`], () =>
    getTemplateDetailEditByUser(user?.uid, `${templateName}-${user?.uid}`)
  );

  const [formData, setFormData] = useState({
    fullname: "Jone Don",
    personalDescription: `Lorem ipsum dolor sit, amet consectetur adipisicing elit. Alia minus est culpa id corrupti nobis ullam harum, porro veniam facilis, obcaecati nulla magnam beatae quae at eos! Qui, similique laboriosam?`,
    refererName: "Sara Taylore",
    refererRole: "Director | Company Name",
    mobile: "+91 0000-0000",
    email: "yourname@gmail.com",
    github: "github.com/jonedon",
    linkedIn: "linkedin.com/jonedon",
    website: "yourwebsite.com",
    address: "your street address, ss, street, city/zip code - 1234",
  });

  const [experiences, setExperiences] = useState([
    {
      year: "Month 20XX - Present Location",
      title: "Job Role",
      companyAndLocation: "Company Name",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis voluptatibus minima tenetur nostrum quo aliquam dolorum incidunt.",
    },
    {
      year: "Month 20XX - Present Location",
      title: "Job Role",
      companyAndLocation: "Company Name",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis voluptatibus minima tenetur nostrum quo aliquam dolorum incidunt.",
    },
    {
      year: "Month 20XX - Present Location",
      title: "Job Role",
      companyAndLocation: "Company Name",
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
    {
      title: "skill6",
      percentage: "75",
    },
  ]);

  const [education, setEducation] = useState([
    {
      major: "Degree Name (Department)",
      university: "University Name",
      year: "Month 20XX - Month 20xx, location",
    },
    {
      major: "Degree Name (Department)",
      university: "University Name",
      year: "Month 20XX - Month 20xx, location",
    },
  ]);

  const [extra, setExtra] = useState([
    {
      award: "Award",
      desc: "Lorem impsum award",
      year: "Month 20XX",
      desc2: "Lorem impsum award",
      year2: "Month 20XX",
    },
  ]);

  const [certificate, setCertificate] = useState([
    {
      name: "Course Name",
      url: "URL: www.certificate.com",
      year: "Month 20XX",
    },
    {
      name: "Course Name",
      url: "URL: www.certificate.com",
      year: "Month 20XX",
    },
  ]);

  const [achieve, setAchieve] = useState([
    {
      achieve: "Achievements",
      desc: "Achievements",
      year: "Month 20XX",
      desc2: "Achievements",
      year2: "Month 20XX",
    },
  ]);

  const [volunteer, setVolunteer] = useState([
    {
      volunteer: "Volunteer Work",
      desc: "Organization",
      year: "Month 20XX",
      desc2: "Organization",
      year2: "Month 20XX",
    },
  ]);

  const [projects, setProjects] = useState([
    {
      projectName: "Project Name",
      desc: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Alia minus est culpa id corrupti nobis ullam harum, porro veniam facilis, obcaecati nulla magnam beatae quae at eos! Qui, similique laboriosam?",
      year: "Month 20XX - Month 20xx, location",
    },
  ]);

  const [language, setLanguage] = useState([
    {
      title: "language 1 (Native)",
    },
    {
      title: "language 2 (Proficient)",
    },
    {
      title: "language 3",
    },
  ]);

  const [hobbies, setHobbies] = useState([
    {
      title: "Hobby 1",
    },
    {
      title: "Hobby 2",
    },
    {
      title: "Hobby 3",
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
    if (resumeData?.extra) {
      setExtra(resumeData?.extra);
    }
    if (resumeData?.achieve) {
      setAchieve(resumeData?.achieve);
    }
    if (resumeData?.certificate) {
      setCertificate(resumeData?.certificate);
    }
    if (resumeData?.volunteer) {
      setVolunteer(resumeData?.volunteer);
    }
    if (resumeData?.language) {
      setLanguage(resumeData?.language);
    }
    if (resumeData?.hobbies) {
      setHobbies(resumeData?.hobbies);
    }
    if (resumeData?.projects) {
      setProjects(resumeData?.projects);
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

  const handleCertificateChange = (index, e) => {
    const { name, value } = e.target;
    const updatedCertificate = [...certificate];
    updatedCertificate[index][name] = value;
    setCertificate(updatedCertificate);
  };

  const handleLanguageChange = (index, e) => {
    const { name, value } = e.target;
    const updatedLanguage = [...language];
    updatedLanguage[index][name] = value;
    setLanguage(updatedLanguage);
  };

  const handleAchieveChange = (index, e) => {
    const { name, value } = e.target;
    const updatedAchieve = [...achieve];
    updatedAchieve[index][name] = value;
    setAchieve(updatedAchieve);
  };

  const handleVolunteerChange = (index, e) => {
    const { name, value } = e.target;
    const updatedVolunteer = [...volunteer];
    updatedVolunteer[index][name] = value;
    setVolunteer(updatedVolunteer);
  };

  const removeSkill = (index) => {
    const updatedSkills = [...skills];
    updatedSkills.splice(index, 1);
    setSkills(updatedSkills);
  };

  const removeCertificate = (index) => {
    const updatedCertificate = [...certificate];
    updatedCertificate.splice(index, 1);
    setCertificate(updatedCertificate);
  };

  const removeLanguage = (index) => {
    const updatedLanguage = [...language];
    updatedLanguage.splice(index, 1);
    setLanguage(updatedLanguage);
  };

  const removeAchieve = (index) => {
    const updatedAchieve = [...achieve];
    updatedAchieve.splice(index, 1);
    setAchieve(updatedAchieve);
  };

  const removeVolunteer = (index) => {
    const updatedVolunteer = [...volunteer];
    updatedVolunteer.splice(index, 1);
    setVolunteer(updatedVolunteer);
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

  const addCertificate = () => {
    const updatedCertificate = [
      ...certificate,
      {
        name: "Course Name",
        url: "URL: www.certificate.com",
        year: "Month 20XX",
      },
    ];
    setCertificate(updatedCertificate);
  };

  const addLanguage = () => {
    const updatedLanguage = [
      ...language,
      {
        title: "language",
      },
    ];
    setLanguage(updatedLanguage);
  };

  const addAchieve = () => {
    const updatedAchieve = [
      ...achieve,
      {
        achieve: "Achievements",
        desc: "Achievements",
        year: "Month 20XX",
        desc2: "Achievements",
        year2: "Month 20XX",
      },
    ];
    setAchieve(updatedAchieve);
  };

  const addVolunteer = () => {
    const updatedVolunteer = [
      ...volunteer,
      {
        volunteer: "Volunteer Work",
        desc: "Organization",
        year: "Month 20XX",
        desc2: "Organization",
        year2: "Month 20XX",
      },
    ];
    setVolunteer(updatedVolunteer);
  };

  const handleEducationChange = (index, e) => {
    const { name, value } = e.target;
    const updatedEdu = [...education];
    updatedEdu[index][name] = value;
    setEducation(updatedEdu);
  };

  const handleExtraChnage = (index, e) => {
    const { name, value } = e.target;
    const updatedExtra = [...education];
    updatedExtra[index][name] = value;
    setExtra(updatedExtra);
  };

  const handleProjectChange = (index, e) => {
    const { name, value } = e.target;
    const updatedProjects = [...projects];
    updatedProjects[index][name] = value;
    setProjects(updatedProjects);
  };

  const removeEducation = (index) => {
    const updatedEdu = [...education];
    updatedEdu.splice(index, 1);
    setEducation(updatedEdu);
  };

  const removeExtra = (index) => {
    const updatedExtra = [...extra];
    updatedExtra.splice(index, 1);
    setExtra(updatedExtra);
  };

  const removeProjects = (index) => {
    const updatedProjects = [...projects];
    updatedProjects.splice(index, 1);
    setProjects(updatedProjects);
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

  const addExtra = () => {
    const updatedExtra = [
      ...extra,
      {
        major: "ENTER YOUR MAJOR",
        university: "Name of your university / college 2005-2009",
      },
    ];
    setExtra(updatedExtra);
  };

  const addProjects = () => {
    const updatedProjects = [
      ...projects,
      {
        projectName: "Project Name",
        desc: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Alia minus est culpa id corrupti nobis ullam harum, porro veniam facilis, obcaecati nulla magnam beatae quae at eos! Qui, similique laboriosam?",
        year: "Month 20XX - Month 20xx, location",
      },
    ];
    setProjects(updatedProjects);
  };

  const saveFormData = async () => {
    const timeStamp = serverTimestamp();
    const resume_id = `${templateName}-${user?.uid}`;
    
    const _doc = {
      _id: loadedTemplateId,
      resume_id,
      formData,
      education,
      projects,
      language,
      hobbies,
      extra,
      volunteer,
      certificate,
      achieve,
      experiences,
      skills,
      timeStamp,
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
          / Template4 /
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
            <div className="col-span-8 flex flex-col items-center justify-start py-6 bg-white">
              <div className="w-full py-6"></div>
              {/* title */}
              <div className="w-full px-8 py-6 bg-[#ffffff]">
                <div className="flex items-center justify-start ">
                  <input
                    type="text"
                    readOnly="true"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    className={`bg-transparent outline-none border-none text-3xl font-sans uppercase tracking-wider text-[#3948CD] font-semibold ${
                      isEdit && "text-white w-full"
                    }`}
                  />
                </div>
              </div>

              {/* about me */}
              <div className="w-full px-8 py-6 flex flex-col items-start justify-start gap-6">
                <div className="w-full">
                  <p className="uppercase text-xl text-[#3948CD] font-semibold tracking-wider">
                    Profile
                  </p>
                  <div className="w-full h-[1px] bg-black my-3"></div>
                  <textarea
                    readOnly="true"
                    className={`text-base text-txtPrimary tracking-wider w-full  outline-none border-none ${
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
                  <p className="uppercase text-xl tracking-wider text-[#3948CD] font-semibold">
                    Experience
                  </p>
                  <div className="w-full h-[1px] bg-black my-3"></div>
                  <div className="w-full flex flex-col items-center justify-start gap-[5px]">
                    <AnimatePresence>
                      {experiences &&
                        experiences?.map((exp, i) => (
                          <motion.div
                            {...opacityINOut(i)}
                            className="w-full flex flex-col"
                            key={i}
                          >
                            <div className="w-[100%]">
                              <AnimatePresence>
                                {isEdit && (
                                  <motion.div
                                    {...FadeInOutWithOpacityAlone}
                                    onClick={() => removeExperience(i)}
                                    className="cursor-pointer absolute right-0 top-2"
                                  >
                                    <FaTrash className="text-base text-txtPrimary" />
                                  </motion.div>
                                )}
                              </AnimatePresence>

                              <div className="flex items-center">
                                <input
                                  value={exp.title}
                                  onChange={(e) => handleExpChange(i, e)}
                                  name="title"
                                  type="text"
                                  readOnly="true"
                                  className={` outline-none border-none font-sans text-lg tracking-wide capitalize text-black border-l-[1px] border-[black] w-[80px] ${
                                    isEdit ? "bg-gray-200" : "bg-transparent"
                                  }`}
                                />
                                <div className="w-[2px] h-[15px] bg-black my-3"></div>
                                <input
                                  value={exp.companyAndLocation}
                                  onChange={(e) => handleExpChange(i, e)}
                                  name="companyAndLocation"
                                  type="text"
                                  readOnly="true"
                                  className={` outline-none ml-3 border-none text-xm tracking-wide capitalize text-black w-full ${
                                    isEdit ? "bg-gray-200" : "bg-transparent"
                                  }`}
                                />
                              </div>
                              <input
                                value={exp.year}
                                onChange={(e) => handleExpChange(i, e)}
                                name="year"
                                type="text"
                                readOnly="true"
                                className={` outline-none border-none text-[12px] tracking-eide uppercase text-black w-full ${
                                  isEdit ? "bg-gray-200" : "bg-transparent"
                                }`}
                              />

                              <textarea
                                readOnly="true"
                                className={`text-[14px] mt-2 text-txtPrimary tracking-wider w-full  outline-none border-none ${
                                  isEdit ? "bg-gray-200" : "bg-transparent"
                                }`}
                                name="description"
                                value={exp.description}
                                onChange={(e) => handleExpChange(i, e)}
                                rows="1"
                                style={{
                                  maxHeight: "auto",
                                  minHeight: "50px",
                                  resize: "none",
                                }}
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

                {/* education */}
                <div className="w-full flex flex-col items-center justify-start gap-6">
                  <div className="w-full">
                    <p className="uppercase text-lg font-semibold text-[#3948CD]">
                      Education
                    </p>
                    <div className="w-full h-[1px] bg-black mt-2"></div>
                    <AnimatePresence>
                      {education &&
                        education?.map((edu, i) => (
                          <motion.div
                            key={i}
                            {...opacityINOut(i)}
                            className="w-full mt-3 relative"
                          >
                            <div className="flex item-center">
                              <input
                                type="text"
                                readOnly="true"
                                name="major"
                                value={edu.major}
                                onChange={(e) => handleEducationChange(i, e)}
                                className={`bg-transparent outline-none border-none text-sm font-semibold w-[41%] uppercase text-black  ${
                                  isEdit && "text-black w-[45%]"
                                }`}
                              />

                              <div className="w-[1px] h-[15px] bg-black mr-3"></div>

                              <input
                                type="text"
                                readOnly="true"
                                name="major"
                                value={edu.university}
                                onChange={(e) => handleEducationChange(i, e)}
                                className={`bg-transparent outline-none border-none text-sm font-semibold w-[50%] text-slate-500  ${
                                  isEdit && "text-black w-[45%]"
                                }`}
                              />
                            </div>

                            <textarea
                              readOnly="true"
                              className={`text-xs text-black mt-2  w-full  outline-none border-none ${
                                isEdit ? "bg-gray-200" : "bg-transparent"
                              }`}
                              name="university"
                              value={edu.year}
                              onChange={(e) => handleEducationChange(i, e)}
                              rows="2"
                              style={{
                                maxHeight: "auto",
                                minHeight: "30px",
                                resize: "none",
                              }}
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

                  {/* reference */}
                  {/* <div className="w-full">
                    <p className="uppercase text-lg font-semibold text-gray-100">
                      Reference
                    </p>
                    <div className="w-full h-[2px] bg-yellow-400 mt-2"></div>
                    <div className="w-full pl-4 mt-3">
                      <input
                        value={formData.refererName}
                        onChange={handleChange}
                        name="refererName"
                        type="text"
                        readOnly="true"
                        className={`bg-transparent outline-none border-none text-base tracking-widest capitalize text-gray-100 w-full ${
                          isEdit && "bg-gray-200"
                        }`}
                      />

                      <input
                        value={formData.refererRole}
                        onChange={handleChange}
                        name="refererRole"
                        type="text"
                        readOnly="true"
                        className={`bg-transparent outline-none border-none text-xs capitalize text-gray-300 w-full ${
                          isEdit && "bg-gray-200"
                        }`}
                      />
                    </div>
                  </div> */}
                </div>

                {/* Projects */}
                <div className="w-full flex flex-col items-center justify-start gap-6">
                  <div className="w-full">
                    <p className="uppercase text-lg font-semibold text-[#3948CD]">
                      Project
                    </p>
                    <div className="w-full h-[1px] bg-black mt-2"></div>
                    <AnimatePresence>
                      {projects &&
                        projects?.map((projects, i) => (
                          <motion.div
                            key={i}
                            {...opacityINOut(i)}
                            className="w-full mt-3 relative"
                          >
                            <input
                              type="text"
                              readOnly="true"
                              name="major"
                              value={projects.projectName}
                              onChange={(e) => handleProjectChange(i, e)}
                              className={`bg-transparent outline-none border-none text-sm font-semibold w-[41%] uppercase text-black  ${
                                isEdit && "text-black w-[45%]"
                              }`}
                            />
                            <br />
                            <input
                              type="text"
                              readOnly="true"
                              name="major"
                              value={projects.year}
                              onChange={(e) => handleProjectChange(i, e)}
                              className={`bg-transparent outline-none border-none text-sm font-semibold w-[50%] text-slate-500  ${
                                isEdit && "text-black w-[45%]"
                              }`}
                            />

                            <textarea
                              readOnly="true"
                              className={`text-xs text-black mt-2  w-full  outline-none border-none ${
                                isEdit ? "bg-gray-200" : "bg-transparent"
                              }`}
                              name="university"
                              value={projects.desc}
                              onChange={(e) => handleProjectChange(i, e)}
                              rows="2"
                              style={{
                                maxHeight: "auto",
                                minHeight: "30px",
                                resize: "none",
                              }}
                            />
                            <AnimatePresence>
                              {isEdit && (
                                <motion.div
                                  {...FadeInOutWithOpacityAlone}
                                  onClick={() => removeProjects(i)}
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
                        onClick={addProjects}
                        className="cursor-pointer"
                      >
                        <FaPlus className="text-base text-gray-100" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* reference */}
                  <div className="w-full">
                    <p className="uppercase text-lg font-semibold text-[#3948CD]">
                      Reference{" "}
                      <span className="text-black text-[14px] capitalize">
                        {" "}
                        - Reference available upon request
                      </span>
                    </p>
                    <div className="w-full h-[2px] bg-black mt-2"></div>
                    {/* <div className="w-full pl-4 mt-3">
                      <input
                        value={formData.refererName}
                        onChange={handleChange}
                        name="refererName"
                        type="text"
                        readOnly="true"
                        className={`bg-transparent outline-none border-none text-base tracking-widest capitalize text-gray-100 w-full ${
                          isEdit && "bg-gray-200"
                        }`}
                      />

                      <input
                        value={formData.refererRole}
                        onChange={handleChange}
                        name="refererRole"
                        type="text"
                        readOnly="true"
                        className={`bg-transparent outline-none border-none text-xs capitalize text-gray-300 w-full ${
                          isEdit && "bg-gray-200"
                        }`}
                      />
                    </div> */}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-4 bg-white flex flex-col items-center justify-start">
              <div className="w-full flex flex-col items-start justify-start mt-6 gap-6">
                {/* email */}
                <div className="w-full grid grid-cols-12 mt-[10%]">
                  <div className="col-span-9">
                    <input
                      value={formData.email}
                      onChange={handleChange}
                      name="email"
                      type="text"
                      readOnly="true"
                      className={`bg-transparent outline-none border-none text-[13px] font-semibold px-3 mt-2 text-[#3948CD] w-full ${
                        isEdit && "bg-gray-200"
                      }`}
                    />
                    <input
                      value={formData.mobile}
                      onChange={handleChange}
                      name="email"
                      type="text"
                      readOnly="true"
                      className={`bg-transparent outline-none border-none text-[13px] font-semibold px-3 mt-2 text-[#3948CD] w-full ${
                        isEdit && "bg-gray-200"
                      }`}
                    />

                    <input
                      value={formData.linkedIn}
                      onChange={handleChange}
                      name="email"
                      type="text"
                      readOnly="true"
                      className={`bg-transparent outline-none border-none text-[13px] font-semibold px-3 mt-2 text-[#3948CD] w-full ${
                        isEdit && "bg-gray-200"
                      }`}
                    />

                    <input
                      value={formData.github}
                      onChange={handleChange}
                      name="email"
                      type="text"
                      readOnly="true"
                      className={`bg-transparent outline-none border-none text-[13px] font-semibold px-3 mt-2 text-[#3948CD] w-full ${
                        isEdit && "bg-gray-200"
                      }`}
                    />
                  </div>
                </div>

                {/* Extra - Curricular */}
                <div className="w-full flex flex-col items-center justify-start gap-6">
                  <div className="w-full">
                    <p className="uppercase text-[16px] font-semibold text-[#3948CD]">
                      Extra-Curricular
                    </p>
                    <div className="w-full h-[1px] bg-black mt-2"></div>
                    <AnimatePresence>
                      {extra &&
                        extra?.map((extra, i) => (
                          <motion.div
                            key={i}
                            {...opacityINOut(i)}
                            className="w-full relative mt-2"
                          >
                            <input
                              type="text"
                              readOnly="true"
                              name="major"
                              value={extra.award}
                              onChange={(e) => handleExtraChnage(i, e)}
                              className={`bg-transparent outline-none border-none text-sm font-semibold w-[41%] uppercase text-black  ${
                                isEdit && "text-black w-[45%]"
                              }`}
                            />
                            <br />
                            <input
                              type="text"
                              readOnly="true"
                              name="major"
                              value={extra.desc}
                              onChange={(e) => handleExtraChnage(i, e)}
                              className={`bg-transparent outline-none border-none text-sm font-semibold w-[50%] text-slate-500  ${
                                isEdit && "text-black w-[45%]"
                              }`}
                            />

                            <textarea
                              readOnly="true"
                              className={`text-xs text-black mt-2  w-full  outline-none border-none ${
                                isEdit ? "bg-gray-200" : "bg-transparent"
                              }`}
                              name="university"
                              value={extra.year}
                              onChange={(e) => handleExtraChnage(i, e)}
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
                              name="major"
                              value={extra.desc2}
                              onChange={(e) => handleExtraChnage(i, e)}
                              className={`bg-transparent outline-none border-none text-sm font-semibold w-[50%] text-slate-500  ${
                                isEdit && "text-black w-[45%]"
                              }`}
                            />

                            <textarea
                              readOnly="true"
                              className={`text-xs text-black mt-2  w-full  outline-none border-none ${
                                isEdit ? "bg-gray-200" : "bg-transparent"
                              }`}
                              name="university"
                              value={extra.year2}
                              onChange={(e) => handleExtraChnage(i, e)}
                              rows="1"
                              style={{
                                maxHeight: "auto",
                                minHeight: "10px",
                                resize: "none",
                              }}
                            />
                            <AnimatePresence>
                              {isEdit && (
                                <motion.div
                                  {...FadeInOutWithOpacityAlone}
                                  onClick={() => removeExtra(i)}
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
                        onClick={addExtra}
                        className="cursor-pointer"
                      >
                        <FaPlus className="text-base text-gray-100" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="w-full flex flex-col items-center justify-start gap-6">
                  <div className="w-full">
                    {/* {Achievements} */}
                    <AnimatePresence>
                      {achieve &&
                        achieve?.map((achieve, i) => (
                          <motion.div
                            key={i}
                            {...opacityINOut(i)}
                            className="w-full relative mt-2"
                          >
                            <input
                              type="text"
                              readOnly="true"
                              name="major"
                              value={achieve.achieve}
                              onChange={(e) => handleAchieveChange(i, e)}
                              className={`bg-transparent outline-none border-none text-sm font-semibold w-[41%] uppercase text-black  ${
                                isEdit && "text-black w-[50%]"
                              }`}
                            />
                            <br />
                            <input
                              type="text"
                              readOnly="true"
                              name="major"
                              value={achieve.desc}
                              onChange={(e) => handleAchieveChange(i, e)}
                              className={`bg-transparent outline-none border-none text-sm font-semibold w-[50%] text-slate-500  ${
                                isEdit && "text-black w-[45%]"
                              }`}
                            />

                            <textarea
                              readOnly="true"
                              className={`text-xs text-black mt-2  w-full  outline-none border-none ${
                                isEdit ? "bg-gray-200" : "bg-transparent"
                              }`}
                              name="university"
                              value={achieve.year}
                              onChange={(e) => handleAchieveChange(i, e)}
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
                              name="major"
                              value={achieve.desc2}
                              onChange={(e) => handleAchieveChange(i, e)}
                              className={`bg-transparent outline-none border-none text-sm font-semibold w-[50%] text-slate-500  ${
                                isEdit && "text-black w-[45%]"
                              }`}
                            />

                            <textarea
                              readOnly="true"
                              className={`text-xs text-black mt-2  w-full  outline-none border-none ${
                                isEdit ? "bg-gray-200" : "bg-transparent"
                              }`}
                              name="university"
                              value={achieve.year2}
                              onChange={(e) => handleAchieveChange(i, e)}
                              rows="1"
                              style={{
                                maxHeight: "auto",
                                minHeight: "10px",
                                resize: "none",
                              }}
                            />
                            <AnimatePresence>
                              {isEdit && (
                                <motion.div
                                  {...FadeInOutWithOpacityAlone}
                                  onClick={() => removeAchieve(i)}
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
                        onClick={addAchieve}
                        className="cursor-pointer"
                      >
                        <FaPlus className="text-base text-gray-100" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="w-full flex flex-col items-center justify-start gap-6">
                  <div className="w-full">
                    {/* {Volunteer} */}
                    <AnimatePresence>
                      {volunteer &&
                        volunteer?.map((volunteer, i) => (
                          <motion.div
                            key={i}
                            {...opacityINOut(i)}
                            className="w-full relative mt-2"
                          >
                            <input
                              type="text"
                              readOnly="true"
                              name="major"
                              value={volunteer.volunteer}
                              onChange={(e) => handleVolunteerChange(i, e)}
                              className={`bg-transparent outline-none border-none text-sm font-semibold w-[41%] uppercase text-black  ${
                                isEdit && "text-black w-[45%]"
                              }`}
                            />
                            <br />
                            <input
                              type="text"
                              readOnly="true"
                              name="major"
                              value={volunteer.desc}
                              onChange={(e) => handleVolunteerChange(i, e)}
                              className={`bg-transparent outline-none border-none text-sm font-semibold w-[50%] text-slate-500  ${
                                isEdit && "text-black w-[45%]"
                              }`}
                            />

                            <textarea
                              readOnly="true"
                              className={`text-xs text-black mt-2  w-full  outline-none border-none ${
                                isEdit ? "bg-gray-200" : "bg-transparent"
                              }`}
                              name="university"
                              value={volunteer.year}
                              onChange={(e) => handleVolunteerChange(i, e)}
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
                              name="major"
                              value={volunteer.desc2}
                              onChange={(e) => handleVolunteerChange(i, e)}
                              className={`bg-transparent outline-none border-none text-sm font-semibold w-[50%] text-slate-500  ${
                                isEdit && "text-black w-[45%]"
                              }`}
                            />

                            <textarea
                              readOnly="true"
                              className={`text-xs text-black mt-2  w-full  outline-none border-none ${
                                isEdit ? "bg-gray-200" : "bg-transparent"
                              }`}
                              name="university"
                              value={volunteer.year2}
                              onChange={(e) => handleVolunteerChange(i, e)}
                              rows="1"
                              style={{
                                maxHeight: "auto",
                                minHeight: "10px",
                                resize: "none",
                              }}
                            />
                            <AnimatePresence>
                              {isEdit && (
                                <motion.div
                                  {...FadeInOutWithOpacityAlone}
                                  onClick={() => removeVolunteer(i)}
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
                        onClick={addVolunteer}
                        className="cursor-pointer"
                      >
                        <FaPlus className="text-base text-gray-100" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* skills */}
                <div className="w-full">
                  <div className="mb-3">
                    <p className="uppercase text-[16px] font-semibold text-[#3948CD]">
                      Skills
                    </p>
                    <div className="w-full h-[1px] bg-black mt-2"></div>
                  </div>

                  <div className="w-full flex flex-wrap items-center justify-start gap-4">
                    <AnimatePresence>
                      {skills &&
                        skills?.map((skill, i) => (
                          <motion.div
                            key={i}
                            {...opacityINOut(i)}
                            className="flex w-[75px]"
                            style={
                              isEdit
                                ? { flexDirection: "column" }
                                : { flexDirection: "row" }
                            }
                          >
                            <div className="w-[30%] flex items-center justify-between">
                              <div className="flex items-center justify-center">
                                <input
                                  value={skill.title}
                                  onChange={(e) => handleSkillsChange(i, e)}
                                  name="title"
                                  type="text"
                                  readOnly="true"
                                  className={` outline-none border-none text-base tracking-wide capitalize font-semibold text-txtPrimary w-fit ${
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

                <div className="w-full flex flex-col items-center justify-start gap-6">
                  <div className="w-full">
                    <p className="uppercase text-[16px] font-semibold text-[#3948CD]">
                      Certificate
                    </p>
                    <div className="w-full h-[1px] bg-black mt-2"></div>
                    {/* {Certificate} */}
                    <AnimatePresence>
                      {certificate &&
                        certificate?.map((certificate, i) => (
                          <motion.div
                            key={i}
                            {...opacityINOut(i)}
                            className="w-full relative mt-2"
                          >
                            <input
                              type="text"
                              readOnly="true"
                              name="major"
                              value={certificate.name}
                              onChange={(e) => handleCertificateChange(i, e)}
                              className={`bg-transparent outline-none border-none text-sm font-semibold w-[41%] uppercase text-black  ${
                                isEdit && "text-black w-[45%]"
                              }`}
                            />
                            <br />
                            <input
                              type="text"
                              readOnly="true"
                              name="major"
                              value={certificate.year}
                              onChange={(e) => handleCertificateChange(i, e)}
                              className={`bg-transparent outline-none border-none text-sm font-semibold w-[50%] text-slate-500  ${
                                isEdit && "text-black w-[45%]"
                              }`}
                            />

                            <textarea
                              readOnly="true"
                              className={`text-xs text-black mt-2  w-full  outline-none border-none ${
                                isEdit ? "bg-gray-200" : "bg-transparent"
                              }`}
                              name="university"
                              value={certificate.url}
                              onChange={(e) => handleCertificateChange(i, e)}
                              rows="1"
                              style={{
                                maxHeight: "auto",
                                minHeight: "10px",
                                resize: "none",
                              }}
                            />

                            <AnimatePresence>
                              {isEdit && (
                                <motion.div
                                  {...FadeInOutWithOpacityAlone}
                                  onClick={() => removeCertificate(i)}
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
                        onClick={addCertificate}
                        className="cursor-pointer"
                      >
                        <FaPlus className="text-base text-gray-100" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Language */}
                <div className="w-full">
                  <div className="mb-3">
                    <p className="uppercase text-[16px] font-semibold text-[#3948CD]">
                      Languages
                    </p>
                    <div className="w-full h-[1px] bg-black mt-2"></div>
                  </div>

                  <div className="w-full flex flex-wrap items-center justify-start gap-4">
                    <AnimatePresence>
                      {language &&
                        language?.map((language, i) => (
                          <motion.div
                            key={i}
                            {...opacityINOut(i)}
                            className="flex items-center w-[300px]"
                            style={
                              isEdit
                                ? { flexDirection: "column" }
                                : { flexDirection: "row" }
                            }
                          >
                            {/* <div className="mr-2">
                              <img alt="" src={circleIcon} />
                            </div> */}
                            <div className="w-[30%] flex items-center justify-between">
                              <div className="flex items-center justify-center">
                                <input
                                  value={language.title}
                                  onChange={(e) => handleLanguageChange(i, e)}
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
                                      value={language.title}
                                      onChange={(e) =>
                                        handleLanguageChange(i, e)
                                      }
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
                                    onClick={() => removeLanguage(i)}
                                    className="cursor-pointer "
                                  >
                                    <FaTrash className="text-base text-txtPrimary" />
                                  </motion.div>
                                )}
                              </AnimatePresence>
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
                          onClick={addLanguage}
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

export default Template4;
