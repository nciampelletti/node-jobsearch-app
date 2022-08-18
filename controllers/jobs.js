const Job = require("../models/Job")
const { StatusCodes } = require("http-status-codes")
const { BadRequestError, NotFoundError } = require("../errors")

const getAllJobs = async (req, res) => {
  const userId = req.user.userId
  const jobs = await Job.find({ createdBy: userId }).sort("createdAt")

  res.status(StatusCodes.OK).json({ jobs, count: jobs.length })
}

const getJob = async (req, res) => {
  const jobId = req.params.id
  const userId = req.user.userId

  const job = await Job.findOne({ _id: jobId, createdBy: userId })

  if (!job) {
    throw new NotFoundError(`No job with id: ${jobId}`)
  }

  res.status(StatusCodes.OK).json({ job })
}

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId
  const job = await Job.create({ ...req.body })
  res.status(StatusCodes.CREATED).json({ job })
}

const updateJob = async (req, res) => {
  const {
    body: { company, position, description, interviewDate },
    user: { userId },
    params: { id: jobId },
  } = req

  if (company === "" || position === "") {
    throw new NotFoundError(`No job with id: ${jobId}`)
  }

  const job = await Job.findOneAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  )

  if (!job) {
    throw new NotFoundError(`No job with id: ${jobId}`)
  }

  res.status(StatusCodes.OK).json({ job })
}

// const deleteJob = async (req, res) => {
//   const {
//     user: { userId },
//     params: { id: jobId },
//   } = req

//   const job = await Job.deleteOne({ _id: jobId, createdBy: userId })

//   if (!job) {
//     throw new NotFoundError(`No job with id: ${jobId}`)
//   }

//   res.status(StatusCodes.OK).send()
// }
const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req

  const job = await Job.findByIdAndRemove({
    _id: jobId,
    createdBy: userId,
  })
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`)
  }
  res.status(StatusCodes.OK).send()
}

module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob }
