"use client";

import { useEffect, useState } from 'react'


import { useDispatch, useSelector } from 'react-redux'

import { useRouter } from 'next/navigation'

import Link from "next/link";

import { toast } from "react-toastify";
import { getCookie } from "cookies-next";




import { AppDispatch } from "@/store";

import {
  onboardVerify,
  setOnboard,
} from '@store/slices/userSlice'


interface Props {
  token: string;
}
const Onboard: React.FC<Props> = ({ token }) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  // const email = useSelector(getUserEmail);
  // const isLoading = useSelector(getuserLoader);
  const [loading, setLoading] = useState(true);
  const [isDisable, setDisable] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  useEffect(() => {
    const userAuthorized = getCookie("isUserAuthenticated");
    if (!userAuthorized) setLoading(false);
    else if (userAuthorized) router.push("/dashboard");
  }, []);

  // const {
  //   setValue,
  //   register,
  //   handleSubmit,
  //   setError,
  //   formState: { errors, isSubmitted },
  // } = useForm({
  //   resolver: yupResolver(schema),
  //   mode: "onBlur", // Validate on blur to show errors properly
  // });
  // useEffect(() => {
  //   setValue("email", email ?? "");
  // }, [email]);

  useEffect(() => {
    dispatch(onboardVerify({ token: decodeURIComponent(token) })).then(
      (response: any) => {
        if (response?.error?.message) {
          toast.error("Token expired");
          setError("confirmPassword", { message: "Token expired" });
          router.push("/404");
        }
      },
    );
  }, [token]);

  // const togglePasswordVisibility = () => {
  //   setPasswordVisible(!passwordVisible);
  // };

  // const toggleConfirmPasswordVisibility = () => {
  //   setConfirmPasswordVisible(!confirmPasswordVisible);
  // };

  const onSubmit = (data: {
    name: string;
    password: string;
    confirmPassword: string;
  }) => {
    try {
      setDisable(true);
      dispatch(setOnboard({ email, ...data }))
        .then((response: any) => {
          if (response?.payload?.status) {
            toast.success(response?.payload?.message);
            setLoading(true);
            router.push("/candidate-dashboard");
          }
        })
        .catch((error: any) =>
          console.error("onSubmit setOnboard error:", error),
        );
    } catch (error) {
      console.log("onSubmit ~ error:", error);
    } finally {
      setTimeout(() => {
        setDisable(false);
      }, 5000);
    }
  };

  // return (
  //   <section className={styles.loginSection}>
  //     {loading && <LoadingModal />}
  //     <Container>
  //       <Row className="justify-content-md-center align-items-center min-vh-100 mt-24">
  //         <Col lg={12}>
  //           <div className={styles.loginForm}>
  //             <div className={styles.logo}>
  //               <Link href="/">
  //                 <Image
  //                   width={222}
  //                   height={96}
  //                   src="/images/logo.png"
  //                   alt="logo"
  //                 />
  //               </Link>
  //             </div>
  //             <h1 className="text-h3 text-center mb-16">Onboard</h1>
  //             <Form noValidate onSubmit={handleSubmit(onSubmit)}>
  //               {/* name */}
  //               <Form.Group controlId="name" className="mb-24">
  //                 <Form.Label>Full Name*</Form.Label>
  //                 <Form.Control
  //                   type="text"
  //                   placeholder="Enter name"
  //                   {...register("name")}
  //                   isInvalid={!!errors.name && isSubmitted}
  //                 />
  //                 <Form.Control.Feedback type="invalid">
  //                   {errors.name?.message}
  //                 </Form.Control.Feedback>
  //               </Form.Group>

  //               <Form.Group controlId="email" className="mb-24">
  //                 <Form.Label>Email*</Form.Label>
  //                 <Form.Control
  //                   type="email"
  //                   value={email ?? ""}
  //                   readOnly
  //                   placeholder="Enter email"
  //                   {...register("email")}
  //                   isInvalid={!!errors.email && isSubmitted}
  //                 />
  //                 <Form.Control.Feedback type="invalid">
  //                   {errors.email?.message}
  //                 </Form.Control.Feedback>
  //               </Form.Group>

  //               {/* Password */}
  //               <Form.Group controlId="password" className="mb-24">
  //                 <Form.Label>Password*</Form.Label>
  //                 <div className="position-relative">
  //                   <span
  //                     className={styles.eyeIcon}
  //                     onClick={togglePasswordVisibility}
  //                   >
  //                     <Image
  //                       width={24}
  //                       height={24}
  //                       src={
  //                         passwordVisible
  //                           ? "/icons/eye.svg"
  //                           : "/icons/eye-slash.svg"
  //                       }
  //                       alt="eye"
  //                     />
  //                   </span>
  //                   <Form.Control
  //                     type={passwordVisible ? "text" : "password"}
  //                     placeholder="Enter password"
  //                     {...register("password")}
  //                     isInvalid={!!errors.password && isSubmitted}
  //                   />
  //                   <Form.Control.Feedback type="invalid">
  //                     {errors.password?.message}
  //                   </Form.Control.Feedback>
  //                 </div>
  //               </Form.Group>

  //               {/* Confirm Password */}
  //               <Form.Group controlId="confirm-password" className="mb-24">
  //                 <Form.Label>Confirm Password*</Form.Label>
  //                 <div className="position-relative">
  //                   <span
  //                     className={styles.eyeIcon}
  //                     onClick={toggleConfirmPasswordVisibility}
  //                   >
  //                     <Image
  //                       width={24}
  //                       height={24}
  //                       src={
  //                         confirmPasswordVisible
  //                           ? "/icons/eye.svg"
  //                           : "/icons/eye-slash.svg"
  //                       }
  //                       alt="eye"
  //                     />
  //                   </span>
  //                   <Form.Control
  //                     type={confirmPasswordVisible ? "text" : "password"}
  //                     placeholder="Enter confirm password"
  //                     {...register("confirmPassword")}
  //                     isInvalid={!!errors.confirmPassword && isSubmitted}
  //                   />
  //                   <Form.Control.Feedback type="invalid">
  //                     {errors.confirmPassword?.message}
  //                   </Form.Control.Feedback>
  //                 </div>
  //               </Form.Group>

  //               {/* Submit Button */}
  //               <Button
  //                 variant="primary"
  //                 size="lg"
  //                 type="submit"
  //                 className="w-100 d-flex align-items-center justify-content-center"
  //                 disabled={isDisable && isLoading}
  //               >
  //                 {isLoading && <Spinner animation="border" className="me-2" />}
  //                 Sign up
  //               </Button>
  //             </Form>
  //           </div>
  //         </Col>
  //       </Row>
  //     </Container>
  //   </section>
  // );
};

export default Onboard;
