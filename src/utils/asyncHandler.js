const asyncHandler = (requestHandler)  => {
  return (req, res, next) =>{
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
  }
}

// const asyncHandler = (fn) => () =>{ 
//   try{
//     await fn(req, res,next)
//   } catch (error) {
//     resizeBy.status(err.code || 500).json({
//       success: false,
//       message: err.message
//     })
//   }
// }


export { asyncHandler }