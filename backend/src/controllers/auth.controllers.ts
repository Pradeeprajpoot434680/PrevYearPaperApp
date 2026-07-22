import bcrypt from 'bcryptjs'
import { signinValidation, signUpValidation } from '../lib/validations.js';
import express from 'express';
import client from '../lib/initClient.js';
import { generateToken } from '../lib/util.js';
import nodemailer from 'nodemailer';
import crypto  from 'crypto';
import { success } from 'zod';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";


// async function sendOTP (email:string,otp :string){
//     console.log(" Sending OTP to:", email);
//       await transporter.sendMail({
//       from: 'pradeepkumar434680@gmail.com',
//       to: email,
//       subject: 'OTP Verification',
//       text: `Your OTP is: ${otp}`
//     });

//        console.log(" OTP sent successfully");
// }

  export async function sendOTP(email: string, otp: string) {
  try {
    console.log("Sending OTP to:", email);

    const data = await resend.emails.send({
    from: "PrevYearPaper App <noreply@emails.prevpaper.fun>",
 // ✅ replace with your verified domain email
      to: [email],
      subject: 'OTP Verification',
      html: `
        <div style="font-family:sans-serif;line-height:1.5;">
          <h2> Email Verification</h2>
          <p>Your One-Time Password (OTP) is:</p>
          <h3 style="color:#2E86DE;">${otp}</h3>
          <p>This OTP will expire in 10 minutes.</p>
          <br/>
          <p>– The Your App Team</p>
        </div>
      `,
    });

    console.log("OTP sent successfully:", data);
    return data;
  } catch (error: any) {
    console.error("Error sending OTP:", error);
    throw new Error("Failed to send OTP email");
  }
}
export const signup = async (req: express.Request, res: express.Response)=>{

    const { name, email, password } = req.body;
    const validation = signUpValidation.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.flatten().fieldErrors });
    }

    //check if user already exists
    const user = await client.user.findUnique({
      where: {
        email
      }
    })

    
    if(user){
      res.status(400).json({ errors: 'User already exists with this Email' });
      return;
    }


    //create a new user 
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const newUser = await client.user.create({
      data:{
        name,
        email,
        password: hashedPassword,
        verficationToken: otp,
        verficationTokenExpiresAt: otpExpiry
      }
    })

    //  token = generateToken(newUser.id,res);


     await sendOTP(email,otp);

     res.status(201).json({ message: 'User registered. Please verify OTP sent to email.',user:newUser});
}


  

    export const sendEmail = async(req:express.Request,res:express.Response)=>{
      //fetch otp from the db req
      const { email } = req.body;
      try {
          if(!email || email == ""){
              return res.status(404).json({message:"Email is blank"})
            }
            const user = await client.user.findUnique({
              where: {
                email
              }
            })


            if (!user) return res.status(400).json({ message: 'User not found' });

            if (user.isVerified) return res.status(400).json({ message: 'User already verified' });

            const otp = generateOTP();

            await client.user.update({
              where:{
                id:user.id
              },
              data:{
                verficationToken:otp,
                verficationTokenExpiresAt:new Date(Date.now() + 10 * 60 * 1000)
              }
            })

            await sendOTP(email,otp);
            

            return res.status(201).json({
            message: "OTP sent successfully"
            })
      } catch (error) {
         console.error(error);
        res.status(500).json({ message: "Server error" });
        
      }
      
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'pradeepkumar434680@gmail.com',
            pass: 'friuzwkebgvpkmbu'
        }
    });


const generateOTP = () => crypto.randomInt(100000, 999999).toString();




export const verifyOTP = async (req:express.Request, res:express.Response) => {
    try {
        const { email, otp } = req.body;
        if(!email || email == ""){
          return res.status(404).json({message:"Email is blank"})
        }

        const user = await client.user.findUnique({
            where: { email }
        });

       
        

      if (!user) return res.status(400).json({ message: 'User not found' });

      if (user.isVerified) return res.status(400).json({ message: 'User already verified' });

      if (!user.verficationToken || user.verficationToken !== otp) {
        return res.status(400).json({ message: 'Invalid OTP' ,user:user});
      }

      if (!user.verficationTokenExpiresAt || user.verficationTokenExpiresAt < new Date()) {
        return res.status(400).json({ message: 'OTP expired' });
      }


        await client.user.update({
            where: { id: user.id },
            data: {
                isVerified: true,
                verficationToken: null,
                verficationTokenExpiresAt: null
            }
        });
        const token = generateToken(user.id,res);
        res.json({ message: 'Email verified successfully. You can now log in.' ,success:"Success",token:token});
    } catch (error) {
        res.status(500).json({ message: 'Error verifying OTP', error });
    }
};


export const resendOTP = async (req:express.Request, res:express.Response) => {
    try {
        const { email } = req.body;
        const user = await client.user.findUnique({
          where:{email}
        });

        if (!user) return res.status(400).json({ message: 'User not found' });
        if (user.isVerified) return res.status(400).json({ message: 'User already verified' });

        const otp = generateOTP();

        await client.user.update({
          where:{
            id:user.id
          },
          data:{
            verficationToken:otp,
            verficationTokenExpiresAt:new Date(Date.now() + 10 * 60 * 1000)
          }
        })
 
        await sendOTP(email,otp);


        res.json({ message: 'OTP resent successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error resending OTP', error });
    }
};








export const signin = async(req:express.Request,res:express.Response)=>{
    const { email , password } = req.body;
    const validation = signinValidation.safeParse(req.body);  

    if(!validation.success){
        return res.status(400).json({ errors: "Incorrect Inputs" });
    }

    const user = await client.user.findUnique({
        where: {
            email
        }
    });

    if (!user) {
        return res.status(400).json({ errorMessage:'User not found' });
    }

    if (!user.isVerified) {
      return res.status(400).json({ errorMessage: 'Email not verified. Please verify OTP.' });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
        return res.status(400).json({ errorMessage: 'Invalid Credentials' });
    }

    // now signin in actually

    const token = generateToken(user.id, res);

    return res.status(200).json({ user, token ,success:success});

};
