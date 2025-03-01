import styles from "./SignIn.module.css";
import google from "../../../assets/google.png";
import OnboardingTemplate from "../../../components/OnboardingTeamplate/OnboardingTemplate";
import OnboardingHeader from "../../../components/OnboardingHeader/OnboardingHeader";

import { Form, Formik } from "formik";
import * as z from "yup";
import { FormikTextInputWithoutLabel as SimpleInput } from "@/MuLearnComponents/FormikComponents/FormikComponents";
import { PowerfulButton } from "@/MuLearnComponents/MuButtons/MuButton";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import {
    login,
    otpVerification,
    requestEmailOrMuidOtp
} from "../../../services/apis";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const inputObject = {
    emailOrMuId: "Email or MuId",
    password: "Password",
    otp: "OTP"
};

export default function SignIn() {
    const toast = useToast();
    const navigate = useNavigate();

    let ruri = window.location.href.split("=")[1];

    const [isLoading, setIsLoading] = useState(false);
    const [otpForm, setOtpForm] = useState(false);
    const [didOtpSent, setDidOtpSent] = useState(false);

    const scheme = z.object({
        emailOrMuId: z
            .string()
            .required(`${inputObject.emailOrMuId} is Required`)
            .min(5, `${inputObject.emailOrMuId} must be at least 3 characters`)
            .max(
                100,
                `${inputObject.emailOrMuId} must be at most 100 characters`
            )
        // ...(!otpForm && {
        //     password: z
        //         .string()
        //         .required(`${inputObject.password} is Required`)
        //         .min(6, `${inputObject.password} must be at least 6 characters`)
        // }),
        // ...(otpForm && {
        //     otp: z
        //         .string()
        //         .required(`${inputObject.otp} is Required`)
        //         .min(5, `${inputObject.otp} must be at least 5 characters`)
        //         .max(5, `${inputObject.otp} must be at most 5 characters`)
        // })
    });

    const onSubmit = (values: any) => {
        console.log(values);

        if (!otpForm) {
            login(
                values.emailOrMuId,
                values.password,
                toast,
                navigate,
                setIsLoading,
                ruri
            );
            return;
        }

        // For OTP Form
        if (!didOtpSent) {
            requestEmailOrMuidOtp({
                emailOrMuid: values.emailOrMuId,
                toast,
                setOtpLoading: setIsLoading,
                setDidOtpSent
            });
        } else {
            otpVerification(
                values.emailOrMuId,
                values.otp,
                toast,
                navigate,
                setIsLoading,
                ruri
            );
        }
    };

    return (
        <OnboardingTemplate>
            <OnboardingHeader
                title={"Hello ! Welcome back"}
                desc={
                    "Hey Welcome, please enter your details to<br/>sign in your account"
                }
            />
            <Formik
                initialValues={Object.fromEntries(
                    Object.keys(inputObject).map(key => [key, ""])
                )}
                validationSchema={scheme}
                onSubmit={onSubmit}
            >
                {formik => (
                    <div>
                        <div className={styles.wrapper}>
                            <Form>
                                {/* {Object.entries(inputObject).map(
                                    ([key, value]) => (
                                        <div
                                            className={styles.inputBox}
                                            key={key}
                                        >
                                            <SimpleInput
                                                onChange={formik.handleChange}
                                                value={
                                                    formik.values[
                                                        key as keyof typeof inputObject
                                                    ]
                                                }
                                                name={key}
                                                placeholder={value}
                                                type={value.toLowerCase()}
                                                disabled={isLoading}
                                            />
                                        </div>
                                    )
                                )} */}
                                <div className={styles.inputBox}>
                                    <SimpleInput
                                        value={formik.values.emailOrMuId}
                                        name="emailOrMuId"
                                        placeholder="Email or MuId"
                                        type="text"
                                        disabled={isLoading}
                                    />
                                </div>
                                {!otpForm ? (
                                    <div className={styles.inputBox}>
                                        <SimpleInput
                                            value={formik.values.password}
                                            name="password"
                                            placeholder="Password"
                                            type="password"
                                            disabled={isLoading}
                                        />
                                    </div>
                                ) : (
                                    didOtpSent && (
                                        <div className={styles.inputBox}>
                                            <SimpleInput
                                                value={formik.values.otp}
                                                name="otp"
                                                placeholder="OTP"
                                                type="text"
                                                disabled={isLoading}
                                            />
                                        </div>
                                    )
                                )}
                                <div className={styles.forgot}>
                                    <a href="forgot-password">
                                        <p>
                                            Forgot your <span>Password</span>
                                        </p>
                                    </a>
                                    <p onClick={() => setOtpForm(!otpForm)}>
                                        Login with{" "}
                                        <span>
                                            {otpForm ? "Password" : "OTP"}
                                        </span>
                                    </p>
                                </div>
                                <div className={styles.submit}>
                                    <PowerfulButton
                                        type="submit"
                                        isLoading={isLoading}
                                    >
                                        {otpForm
                                            ? didOtpSent
                                                ? "Sign in with OTP"
                                                : "Request OTP"
                                            : "Sign in"}
                                    </PowerfulButton>
                                    {/* <p>OR</p>
                                    <PowerfulButton
                                        variant="ghost"
                                        className={styles.google}
                                        type="button"
                                    >
                                        <FcGoogle size={30} />
                                        <p>Sign in with google</p>
                                    </PowerfulButton> */}
                                </div>
                                <div className={styles.noAccount}>
                                    <a href="/signup">
                                        Don't have an account? Sign up
                                    </a>
                                </div>
                            </Form>
                        </div>
                    </div>
                )}
            </Formik>
        </OnboardingTemplate>
    );
}
