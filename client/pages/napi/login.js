const Login = (req, res) => {
  const data = req.body
  console.log(data)
  res.status(200).json({token: 'asd'})
}

export default Login
