import { BadGatewayException, ConflictException, Injectable } from '@nestjs/common';
import ReturnResponse from 'src/helper/returnResponse';
import * as bcrypt from "bcryptjs"
import * as jwt from 'jsonwebtoken'
import { PrismaService } from 'src/prisma/prisma.service';

interface SignupParams
{
    password:string
    username:string
}

interface LoginParams
{
    password:string
    username:string
}

@Injectable()
export class AuthService 
{
    constructor( private readonly prismaSirvce:PrismaService){}

    async signup({username,password}:SignupParams)
    {
        const userExists = await this.prismaSirvce.user.findUnique(
            {
                where:
                {
                    username
                },
            })

            if (userExists)
            {
                throw new ConflictException(ReturnResponse({},[{field:"email",error:"Username Already Exists"}]))
            }

            const hashedPassword = await bcrypt.hash(password, 10)

            const user = await this.prismaSirvce?.user.create(
                {
                    data:
                    {
                        username:username,
                        password:hashedPassword,
                    }
                })

                const token = await this.generateJWT(user?.username,user.id)

                return ReturnResponse({user_token: token},'',"User Created Successfully")       
    }

    private async generateJWT( name:string,id?:number )
    {
        return jwt.sign(
            {
                name:name,
                id:id
            },process.env.JSON_TOKEN_KEY,{expiresIn:3600000})
    }

    async login({username,password}:LoginParams)
    {
        const getUserByEmail = await this.prismaSirvce.user.findUnique(
            {
                where:
                {
                    username
                },
            })

            if(!getUserByEmail)
            {
                throw new BadGatewayException(ReturnResponse({},"Username or Password incorrect"))
            }
            const isValidPassword = await bcrypt?.compare(password, getUserByEmail?.password)

            if (getUserByEmail && isValidPassword)
            {
                const token = await this.generateJWT(getUserByEmail?.username,getUserByEmail?.id)

                return ReturnResponse({user_token: token},'',"")   
            }
            else
            {
                throw new BadGatewayException(ReturnResponse({},"Username or Password incorrect"))
            }
    }
}
