"use client";

import React, { useState } from "react";

import {
  Heading,
  Text,
  Button,
  Icon,
  InlineCode,
  Logo,
  Input,
  Avatar,
  AvatarGroup,
  Textarea,
  PasswordInput,
  SegmentedControl,
  SmartLink,
  Dialog,
  Feedback,
  SmartImage,
  Line,
  LogoCloud,
  Background,
  Select,
  useToast,
  Card,
  Fade,
  StatusIndicator,
  DateRangePicker,
  DateRange,
  TiltFx,
  HoloFx,
  IconButton,
  TagInput,
  Switch,
  Column,
  Row,
  StyleOverlay,
} from "@/once-ui/components";
import { CodeBlock, MediaUpload } from "@/once-ui/modules";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { addToast } = useToast();

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    // Simulate an API call
    try {
      // Replace with your actual login logic
      if (username === "admin" && password === "password") {
        addToast({
          variant: "success",
          message: "Login successful",
        });
      } else {
        throw new Error("Invalid username or password");
      }
    } catch (err: any) {
      setError(err.message);
      addToast({
        variant: "danger",
        message: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Column fillWidth paddingY="160" paddingX="xl" alignItems="center" flex={10}>
      <Fade
        zIndex={3}
        pattern={{
          display: true,
          size: "1",
        }}
        position="fixed"
        top="0"
        left="0"
        to="bottom"
        height={10}
        fillWidth
        blur={0.55}
      />
      <Column
        fillWidth
        alignItems="center"
        gap="48"
        radius="xl"
        paddingTop="160"
        paddingBottom="160"
        position="relative"
      >
        <Row position="fixed" top="80" fillWidth justifyContent="center" zIndex={3}>
          <Column fillWidth alignItems="center" gap="32" padding="32" position="relative">
            <Column fillWidth paddingX="80" gap="24" alignItems="center" position="relative">
              <Row
                marginY="160"
                background="overlay"
                fillWidth
                radius="xl"
                border="neutral-alpha-weak"
                overflow="hidden"
                justifyContent="center" // Center the border horizontally
                alignItems="center"    // Center the border vertically
              >
                <Row fill hide="l">
                  <SmartImage src="/images/login.png" alt="Preview image" sizes="560px" />
                </Row>
                <Column fillWidth alignItems="center" gap="40" padding="80" position="relative">
                  <Background
                    mask={{
                      x: 100,
                      y: 0,
                      radius: 75,
                    }}
                    position="absolute"
                    grid={{
                      display: true,
                      opacity: 50,
                      width: "0.5rem",
                      color: "brand-alpha-medium",
                      height: "1rem",
                    }}
                  />
                  <Logo wordmark={false} size="l" />
                  <Heading as="h3" variant="display-default-s">
                    Welcome to School Hub
                  </Heading>
                  <Text onBackground="neutral-medium" marginBottom="24">
                    Login in or <SmartLink href="/">home</SmartLink>
                  </Text>
                  <Column gap="-1" fillWidth>
                    <Input
                      id="username"
                      label="Username"
                      labelAsPlaceholder
                      onChange={(e) => setUsername(e.target.value)}
                      value={username}
                      errorMessage={false}
                      radius="top"
                    />
                    <PasswordInput
                      autoComplete="new-password"
                      id="password"
                      label="Password"
                      labelAsPlaceholder
                      radius="bottom"
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                      errorMessage={false}
                    />
                  </Column>
                  <Button
                    id="login"
                    label={loading ? "Logging in..." : "Log in"}
                    arrowIcon
                    fillWidth
                    onClick={handleLogin}
                    disabled={loading}
                  />
                </Column>
              </Row>
            </Column>
          </Column>
        </Row>
      </Column>
    </Column>
  );
}