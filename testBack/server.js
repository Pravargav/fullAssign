// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/jobboard?retryWrites=true&w=majority')
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// Job Schema
const jobSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    required: true,
    trim: true
  },
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  jobType: {
    type: String,
    required: true,
    enum: ['full-time', 'part-time', 'contract', 'internship']
  },
  salaryFrom: {
    type: String,
    trim: true
  },
  salaryTo: {
    type: String,
    trim: true
  },
  jobDescription: {
    type: String,
    required: true
  },
  requirements: {
    type: String,
    required: true
  },
  responsibilities: {
    type: String,
    required: true
  },
  applicationDeadline: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Job = mongoose.model('Job', jobSchema);

const sampleJobs = []

async function insertSampleJobs() {
  try {
    const result = await Job.insertMany(sampleJobs);
    console.log(`${result.length} jobs inserted successfully!`);
    console.log('Inserted job IDs:', result.map(job => job._id));
  } catch (error) {
    console.error('Error inserting jobs:', error);
  }
}

// Routes
// Create a new job
app.post('/api/jobs', async (req, res) => {
  try {
    const {
      jobTitle,
      companyName,
      location,
      jobType,
      salaryFrom,
      salaryTo,
      jobDescription,
      requirements,
      responsibilities,
      applicationDeadline
    } = req.body;

    // Validation
    if (!jobTitle || !companyName || !location || !jobType || !jobDescription || !requirements || !responsibilities || !applicationDeadline) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    const newJob = new Job({
      jobTitle,
      companyName,
      location,
      jobType,
      salaryFrom,
      salaryTo,
      jobDescription,
      requirements,
      responsibilities,
      applicationDeadline
    });

    const savedJob = await newJob.save();
    
    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: savedJob
    });

  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating job',
      error: error.message
    });
  }
});

// Get all jobs with pagination and filtering
app.get('/api/jobs', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Extract filter parameters
    const {
      jobTitle,
      location,
      jobType,
      minSalary,
      maxSalary
    } = req.query;

    // Build filter object
    const filter = {};

    // Job title filter (case-insensitive partial match)
    if (jobTitle && jobTitle.trim()) {
      filter.jobTitle = { $regex: jobTitle.trim(), $options: 'i' };
    }

    // Location filter (case-insensitive partial match)
    if (location && location.trim()) {
      filter.location = { $regex: location.trim(), $options: 'i' };
    }

    // Job type filter (exact match)
    if (jobType && jobType.trim()) {
      filter.jobType = jobType.trim();
    }

    // Salary range filter
    if (minSalary || maxSalary) {
      const salaryFilter = {};
      
      if (minSalary) {
        const minSalaryNum = parseInt(minSalary);
        if (!isNaN(minSalaryNum)) {
          // Check if salaryFrom exists and is greater than or equal to minSalary
          salaryFilter.$or = [
            { salaryFrom: { $gte: minSalaryNum.toString() } },
            { salaryTo: { $gte: minSalaryNum.toString() } }
          ];
        }
      }
      
      if (maxSalary) {
        const maxSalaryNum = parseInt(maxSalary);
        if (!isNaN(maxSalaryNum)) {
          // Check if salaryTo exists and is less than or equal to maxSalary
          if (salaryFilter.$or) {
            // If we already have a minSalary condition, we need to combine them
            filter.$and = [
              { $or: salaryFilter.$or },
              {
                $or: [
                  { salaryFrom: { $lte: maxSalaryNum.toString() } },
                  { salaryTo: { $lte: maxSalaryNum.toString() } }
                ]
              }
            ];
          } else {
            salaryFilter.$or = [
              { salaryFrom: { $lte: maxSalaryNum.toString() } },
              { salaryTo: { $lte: maxSalaryNum.toString() } }
            ];
          }
        }
      }
      
      // If we don't have $and already set, add the salary filter
      if (!filter.$and && salaryFilter.$or) {
        filter.$or = salaryFilter.$or;
      }
    }

    console.log('Applied filters:', JSON.stringify(filter, null, 2));

    // Find jobs with filters applied
    const jobs = await Job.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Count total documents matching the filter
    const total = await Job.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: jobs,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: jobs.length,
        totalJobs: total
      },
      appliedFilters: {
        jobTitle: jobTitle || null,
        location: location || null,
        jobType: jobType || null,
        minSalary: minSalary || null,
        maxSalary: maxSalary || null
      }
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching jobs',
      error: error.message
    });
  }
});

// Get job by ID
app.get('/api/jobs/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    res.status(200).json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching job',
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Search jobs (legacy endpoint - kept for backward compatibility)
app.get('/api/jobs/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const searchRegex = new RegExp(query, 'i');
    
    const jobs = await Job.find({
      $or: [
        { jobTitle: searchRegex },
        { companyName: searchRegex },
        { location: searchRegex },
        { jobDescription: searchRegex }
      ]
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: jobs,
      count: jobs.length
    });
  } catch (error) {
    console.error('Error searching jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching jobs',
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});