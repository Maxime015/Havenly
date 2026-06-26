import TabScreenBackground from "@/components/TabScreenBackground";
import { useAuth, useSignUp } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";

export default function SignUpScreen() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const placeholderColor = isDark ? "#64748b" : "#9CA3AF";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const onSignUpPress = async () => {
    const { error } = await signUp.password({
      emailAddress: email,
      password,
      firstName,
      lastName,
    });
    if (error) {
      console.log(JSON.stringify(error, null, 2));
      return;
    }

    if (!error) await signUp.verifications.sendEmailCode();
  };

  const onVerifyPress = async () => {
    await signUp.verifications.verifyEmailCode({
      code,
    });

    if (signUp.status === "complete") {
      await signUp.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log(session?.currentTask);
            return;
          }
          const url = decorateUrl("/");
          router.replace(url as any);
        },
      });
    } else {
      console.log("Sign-up attempt not complete:", signUp);
    }
  };

  const isLoading = fetchStatus === "fetching";

  if (signUp.status === "complete" || isSignedIn) {
    return null;
  }

  // OTP verification screen
  if (
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0
  ) {
    return (
      <Animated.View
        style={{ flex: 1, opacity: fadeAnim }}
        className="justify-center items-center bg-background px-8"
      >
        <View className="absolute top-20 left-0 right-0" pointerEvents="none">
          <TabScreenBackground />
        </View>
        <Image
          source={require("../../assets/images/icon.png")}
          className="w-40 h-40 self-center mb-4 rounded-3xl overflow-hidden"
          resizeMode="cover"
        />
        <Text className="text-3xl font-bold text-foreground mb-2 text-center">
          Verification
        </Text>
        <Text className="text-muted-foreground mb-8 text-center px-4 text-base">
          We sent a code to{"\n"}
          <Text className="font-bold text-foreground">{email}</Text>
        </Text>

        <TextInput
          /* Modification ici : text-base remplacé par text-lg */
          className="w-full bg-card border border-border text-foreground rounded-2xl px-5 py-4 mb-4 text-lg"
          placeholder="Verification code"
          placeholderTextColor={placeholderColor}
          keyboardType="number-pad"
          value={code}
          onChangeText={setCode}
        />
        {errors.fields.code && (
          <Text className="text-destructive-foreground mb-4 self-start ml-2">
            {errors.fields.code.message}
          </Text>
        )}

        <TouchableOpacity
          onPress={onVerifyPress}
          disabled={isLoading}
          className="w-full bg-primary py-4 rounded-2xl items-center mb-6 shadow-sm"
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-primary-foreground font-bold text-lg">
              Verify
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => signUp.verifications.sendEmailCode()}
          className="py-2 mb-2"
        >
          <Text className="text-primary font-medium text-base">
            Resend code
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => signUp.reset()} className="py-2">
          <Text className="text-muted-foreground font-medium text-base">
            Start over
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  // Sign up form
  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      className="bg-background"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Animated.View
        style={{ flex: 1, opacity: fadeAnim }}
        className="justify-center px-8 py-12"
      >
        <View className="absolute top-20 left-0 right-0" pointerEvents="none">
          <TabScreenBackground />
        </View>
        <Image
          source={require("../../assets/images/icon.png")}
          className="w-40 h-40 self-center mb-4 rounded-3xl overflow-hidden"
          resizeMode="cover"
        />
        <Text className="text-4xl font-extrabold text-foreground mb-2 text-center tracking-tight">
          Create an account
        </Text>
        <Text className="text-muted-foreground text-base mb-10 text-center">
          Join us today
        </Text>

        <View className="flex-row gap-4 mb-4">
          <TextInput
            /* Modification ici : text-base remplacé par text-lg */
            className="flex-1 bg-card border border-border text-foreground rounded-2xl px-5 py-4 text-lg"
            placeholder="First name"
            placeholderTextColor={placeholderColor}
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="words"
          />
          <TextInput
            /* Modification ici : text-base remplacé par text-lg */
            className="flex-1 bg-card border border-border text-foreground rounded-2xl px-5 py-4 text-lg"
            placeholder="Last name"
            placeholderTextColor={placeholderColor}
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="words"
          />
        </View>

        <TextInput
          /* Modification ici : text-base remplacé par text-lg */
          className="w-full bg-card border border-border text-foreground rounded-2xl px-5 py-4 mb-4 text-lg"
          placeholder="Email address"
          placeholderTextColor={placeholderColor}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.fields.emailAddress && (
          <Text className="text-destructive-foreground mb-4 ml-2">
            {errors.fields.emailAddress.message}
          </Text>
        )}

        <TextInput
          /* Modification ici : text-base remplacé par text-lg */
          className="w-full bg-card border border-border text-foreground rounded-2xl px-5 py-4 mb-8 text-lg"
          placeholder="Password"
          placeholderTextColor={placeholderColor}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {errors.fields.password && (
          <Text className="text-destructive-foreground mb-6 ml-2 -mt-4">
            {errors.fields.password.message}
          </Text>
        )}

        <TouchableOpacity
          onPress={onSignUpPress}
          disabled={isLoading}
          className="w-full bg-primary py-4 rounded-2xl items-center mb-8 shadow-sm"
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-primary-foreground font-bold text-lg">
              Sign up
            </Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center items-center mt-2">
          <Text className="text-muted-foreground text-base">
            Already have an account?{" "}
          </Text>
          <Link href="/sign-in">
            <Text className="text-primary font-bold text-base">Sign in</Text>
          </Link>
        </View>

        <View nativeID="clerk-captcha" />
      </Animated.View>
    </ScrollView>
  );
}
