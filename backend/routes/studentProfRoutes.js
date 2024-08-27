const express = require("express");
const Student = require("../schema/studentSchema");

const router = express.Router();

router.get("/:userId/education", async (req, res) => {
  try {
    const userId = req.params.userId;
    const student = await Student.findById(userId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (!student.education || student.education.length === 0) {
      return res.status(404).json({
        message: "Student having the education field is not available",
      });
    }
    console.log(student.education);
    res.status(200).json(student.education);
  } catch (error) {
    console.error("Error fetching education details:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/:userId/education", async (req, res) => {
  try {
    const { degree, fieldOfStudy, institution, startYear, endYear, score } =
      req.body;
    const userId = req.params.userId;

    console.log("Request Body:", req.body);

    const student = await Student.findById(userId);

    if (!student) return res.status(404).json({ message: "Student not found" });

    student.education.push({
      degree,
      fieldOfStudy,
      institution,
      startYear,
      endYear,
      score,
    });

    // Save the updated student document
    await student.save();

    res.status(200).json({
      message: "Education details added successfully",
      education: student.education,
    });
  } catch (error) {
    console.error("Error updating education details:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

router.put("/:userId/education/:index", async (req, res) => {
  const { userId, index } = req.params;
  const { degree, fieldOfStudy, institution, startYear, endYear, score } =
    req.body;

  try {
    const student = await Student.findById(userId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Ensure the index is within the bounds of the array
    if (index < 0 || index >= student.education.length) {
      return res.status(400).json({ message: "Invalid education index" });
    }

    // Update the education details
    student.education[index] = {
      degree,
      fieldOfStudy,
      institution,
      startYear,
      endYear,
      score,
    };
    await student.save();

    res.status(200).json(student.education[index]);
  } catch (error) {
    console.error("Error updating education details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/:userId/education/:index", async (req, res) => {
  const { userId, index } = req.params;
  console.log("inside delete backend");
  try {
    const student = await Student.findById(userId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Ensure the index is within the bounds of the array
    if (index < 0 || index >= student.education.length) {
      return res.status(400).json({ message: "Invalid education index" });
    }

    // Remove the education details at the specified index
    student.education.splice(index, 1);
    await student.save();

    res.status(200).json({ message: "Education details deleted" });
  } catch (error) {
    console.error("Error deleting education details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:userId/work-experience", async (req, res) => {
  try {
    const userId = req.params.userId;
    const student = await Student.findById(userId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    if (!student.workExperience || student.workExperience.length === 0) {
      return res.status(404).json({
        message: "Student having the workExperience field is not available",
      });
    }

    res.status(200).json(student.workExperience);
  } catch (error) {
    console.error("Error fetching workExperience details:", error);
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/:userId/work-experience", async (req, res) => {
  try {
    const { userId } = req.params;
    const { company, role, startDate, endDate, typeofwork, description } =
      req.body;

    // const start = new Date(startDate);
    // const end = new Date(endDate);

    // Validate dates

    // Find the student by ID
    const student = await Student.findById(userId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    console.log("foundddddddd");

    // Add new work experience
    student.workExperience.push({
      company,
      role,
      startDate,
      endDate,
      typeofwork,
      description,
    });

    // Save the updated student document
    await student.save();

    // Respond with success
    res.status(200).json({
      message: "Work experience details added successfully",
      workExperience: student.workExperience,
    });
  } catch (error) {
    console.error("Error adding work experience:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/:userId/work-experience/:index", async (req, res) => {
  try {
    const { userId, index } = req.params;
    const { company, role, startDate, endDate, typeofwork, description } =
      req.body;
    const student = await Student.findById(userId);
    if (!student) return res.status(404).json({ message: "Student not found" });
    if (index < 0 || index >= student.workExperience.length)
      return res.status(400).json({ message: "Invalid workExperience index" });

    student.workExperience[index] = {
      company,
      role,
      startDate,
      endDate,
      typeofwork,
      description,
    };
    await student.save();
    res.status(200).json(student.education[index]);
  } catch (error) {
    console.error("Error updating workexperience details:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:userId/work-experience/:index", async (req, res) => {
  try {
    const { userId, index } = req.params;
    const student = await Student.findById(userId);
    if (!student) return res.status(404).json({ message: "student not found" });

    if (index < 0 || index >= student.workExperience.length) {
      return res.status(400).json({ message: "Invalid workExperience index" });
    }

    // Remove the education details at the specified index
    student.workExperience.splice(index, 1);
    await student.save();
    res.status(200).json({ message: "Education details deleted" });
  } catch (error) {
    console.error("Error deleting workexperience details:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:userId/certificates", async (req, res) => {
  try {
    const { userId } = req.params;
    const student = await Student.findById(userId);
    if (!student) return res.status(404).json({ message: "User not found" });

    if (!student.certificates || student.certificates.length === 0)
      return res.status(404).json({
        message: "Student having certificates field is not available",
      });
    res.status(200).json(student.certificates);
  } catch (error) {
    console.error("Error fetching certificates details:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/:userId/certificates", async (req, res) => {
  try {
    const { userId } = req.params;
    const { title, issuingOrganization, issueDate, description } = req.body;
    const student = await Student.findById(userId);
    if (!student) return res.status(404).json({ message: "User not found" });
    student.certificates.push({
      title,
      issuingOrganization,
      issueDate,
      description,
    });
    await student.save();
    res.status(200).json({
      message: "Certificates details added successfully",
      certificates: student.certificates,
    });
  } catch (error) {
    console.error("Error adding certificate", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/:userId/certificates/:index", async (req, res) => {
  try {
    const { userId, index } = req.params;
    const { title, issuingOrganization, issueDate, description } = req.body;
    const student = await Student.findById(userId);
    if (!student) return res.status(404).json({ message: "User not found" });
    if (index < 0 || student.certificates.length <= index)
      return res.status(400).json({ message: "Invalid education index" });

    student.certificates[index] = {
      title,
      issuingOrganization,
      issueDate,
      description,
    };
    await student.save();
    res.status(200).json(student.certificates[index]);
  } catch (error) {
    console.error("Error updating certificate details:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:userId/certificates/:index", async (req, res) => {
  try {
    const { userId, index } = req.params;
    const student = await Student.findById(userId);
    if (!student) return res.status(404).json({ message: "student not found" });

    if (index < 0 || index >= student.certificates.length) {
      return res.status(400).json({ message: "Invalid certificate index" });
    }

    // Remove the education details at the specified index
    student.certificates.splice(index, 1);
    await student.save();
    res.status(200).json({ message: "certificate details deleted" });
  } catch (error) {
    console.error("Error deleting certificate details:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:userId/personal-projects", async (req, res) => {
  try {
    const { userId } = req.params;
    const student = await Student.findById(userId);
    if (!student) return res.status(404).json({ message: "User not found" });

    if (!student.personalProjects || student.personalProjects.length === 0)
      return res.status(404).json({
        message: "Student having personalProjects field is not available",
      });
    res.status(200).json(student.personalProjects);
  } catch (error) {
    console.error("Error fetching personalProjects details:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/:userId/personal-projects", async (req, res) => {
  try {
    const { userId } = req.params;
    const { title, link, description } = req.body;
    const student = await Student.findById(userId);
    if (!student) return res.status(404).json({ message: "User not found" });
    student.personalProjects.push({
      title,
      description,
      link,
    });
    await student.save();
    res.status(200).json({
      personalProjects: student.personalProjects,
    });
  } catch (error) {
    console.error("Error adding personalProjects", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/:userId/personal-projects/:index", async (req, res) => {
  try {
    const { userId, index } = req.params;
    const { title, link, description } = req.body;
    const student = await Student.findById(userId);
    if (!student) return res.status(404).json({ message: "User not found" });
    if (index < 0 || student.personalProjects.length <= index)
      return res
        .status(400)
        .json({ message: "Invalid personalProjects index" });

    student.personalProjects[index] = {
      title,
      link,
      description,
    };
    await student.save();
    res.status(200).json(student.certificates[index]);
  } catch (error) {
    console.error("Error updating personalProjects details:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:userId/personal-projects/:index", async (req, res) => {
  try {
    const { userId, index } = req.params;
    const student = await Student.findById(userId);
    if (!student) return res.status(404).json({ message: "student not found" });

    if (index < 0 || index >= student.personalProjects.length) {
      return res
        .status(400)
        .json({ message: "Invalid personalProjects index" });
    }

    // Remove the education details at the specified index
    student.personalProjects.splice(index, 1);
    await student.save();
    res.status(200).json({ message: "personalProjects details deleted" });
  } catch (error) {
    console.error("Error deleting personalProjects details:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:userId/skills", async (req, res) => {
  try {
    const { userId } = req.params;
    const student = await Student.findById(userId);
    if (!student) return res.status(404).json({ message: "User not found" });

    if (!student.skills || student.skills.length === 0)
      return res.status(404).json({
        message: "Student having skills field is not available",
      });
    res.status(200).json(student.skills);
  } catch (error) {
    console.error("Error fetching skills details:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/:userId/skills", async (req, res) => {
  try {
    const { userId } = req.params;
    const { skillName, proficiency } = req.body;
    const student = await Student.findById(userId);
    if (!student) return res.status(404).json({ message: "User not found" });
    student.skills.push({ skillName, proficiency });

    await student.save();
    res.status(200).json({
      skills: student.skills,
    });
  } catch (error) {
    console.error("Error adding skills", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/:userId/skills/:index", async (req, res) => {
  try {
    const { userId, index } = req.params;
    const { skillName, proficiency } = req.body;
    const student = await Student.findById(userId);
    if (!student) return res.status(404).json({ message: "User not found" });
    if (index < 0 || student.skills.length <= index)
      return res.status(400).json({ message: "Invalid skills index" });

    student.skills[index] = {
      skillName,
      proficiency,
    };
    await student.save();
    res.status(200).json(student.skills[index]);
  } catch (error) {
    console.error("Error updating skills details:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:userId/skills/:index", async (req, res) => {
  try {
    const { userId, index } = req.params;
    const student = await Student.findById(userId);
    if (!student) return res.status(404).json({ message: "student not found" });

    if (index < 0 || index >= student.skills.length) {
      return res.status(400).json({ message: "Invalid skills index" });
    }

    // Remove the education details at the specified index
    student.skills.splice(index, 1);
    await student.save();
    res.status(200).json({ message: "skills details deleted" });
  } catch (error) {
    console.error("Error deleting skills details:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:userId/portfolioLinks", async (req, res) => {
  try {
    const { userId } = req.params;
    const student = await Student.findById(userId);
    if (!student) return res.status(404).json({ message: "User not found" });

    if (!student.portfolioLink || student.portfolioLink.length === 0)
      return res.status(404).json({
        message: "Student having portfolioLink field is not available",
      });
    res.status(200).json(student.portfolioLink);
  } catch (error) {
    console.error("Error fetching skills details:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/:userId/portfolioLinks", async (req, res) => {
  try {
    const { userId } = req.params;
    const { linkType, linkUrl } = req.body;
    const student = await Student.findById(userId);
    if (!student) return res.status(404).json({ message: "User not found" });
    student.portfolioLink.push({ linkType, linkUrl });

    await student.save();
    res.status(200).json({
      portfolioLink: student.portfolioLink
    });
  } catch (error) {
    console.error("Error adding portfolioLink", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/:userId/portfolioLinks/:index", async (req, res) => {
  try {
    const { userId, index } = req.params;
    const { linkType, linkUrl } = req.body;
    const student = await Student.findById(userId);
    if (!student) return res.status(404).json({ message: "User not found" });
    if (index < 0 || student.portfolioLink.length <= index)
      return res.status(400).json({ message: "Invalid portfolioLink index" });

    student.portfolioLink[index] = {
      linkType,
      linkUrl,
    };
    await student.save();
    res.status(200).json(student.portfolioLink[index]);
  } catch (error) {
    console.error("Error updating portfolioLink details:", error);
    res.status(500).json({ message: "Server error" });
  }
});


router.delete("/:userId/portfolioLinks/:index", async (req, res) => {
  try {
    const { userId, index } = req.params;
    const student = await Student.findById(userId);
    if (!student) return res.status(404).json({ message: "student not found" });

    if (index < 0 || index >= student.portfolioLink.length) {
      return res.status(400).json({ message: "Invalid portfolioLink index" });
    }

    // Remove the education details at the specified index
    student.portfolioLink.splice(index, 1);
    await student.save();
    res.status(200).json({ message: "portfolioLink details deleted" });
  } catch (error) {
    console.error("Error deleting portfolioLink details:", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
