import TabScreenBackground from "@/components/TabScreenBackground";
import { useSignIn } from "@clerk/expo";
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

export default function SignInScreen() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const placeholderColor = isDark ? "#64748b" : "#9CA3AF";

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

  const onSignInPress = async () => {
    const { error } = await signIn.password({
      emailAddress: email,
      password,
    });
    if (error) {
      return;
    }

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log(session?.currentTask);
            return;
          }
          const url = decorateUrl("/");
          router.replace(url as any);
        },
      });
    } else if (signIn.status === "needs_second_factor") {
      await signIn.mfa.sendPhoneCode();
    } else if (signIn.status === "needs_client_trust") {
      const emailCodeFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === "email_code",
      );
      if (emailCodeFactor) {
        await signIn.mfa.sendEmailCode();
      }
    } else {
      console.log("Sign-in attempt not complete:", signIn);
    }
  };

  const onVerifyPress = async () => {
    await signIn.mfa.verifyEmailCode({ code });

    if (signIn.status === "complete") {
      await signIn.finalize({
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
      console.log("Sign-in attempt not complete:", signIn);
    }
  };

  const isLoading = fetchStatus === "fetching";

  if (signIn.status === "needs_client_trust") {
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
        <Text className="text-muted-foreground mb-8 text-center px-4">
          Enter the code sent to your email address to continue.
        </Text>

        <TextInput
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
          onPress={() => signIn.mfa.sendEmailCode()}
          className="py-2 mb-2"
        >
          <Text className="text-primary font-medium text-base">
            Resend code
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => signIn.reset()} className="py-2">
          <Text className="text-muted-foreground font-medium text-base">
            Start over
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      className="bg-background"
      keyboardShouldPersistTaps="handled"
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
          Welcome back
        </Text>
        <Text className="text-muted-foreground text-base mb-10 text-center">
          Sign in to your account
        </Text>

        <TextInput
          className="w-full bg-card border border-border text-foreground rounded-2xl px-5 py-4 mb-4 text-lg"
          placeholder="Email address"
          placeholderTextColor={placeholderColor}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.fields.identifier && (
          <Text className="text-destructive-foreground mb-4 ml-2">
            {errors.fields.identifier.message}
          </Text>
        )}

        <TextInput
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
          onPress={onSignInPress}
          disabled={isLoading}
          className="w-full bg-primary py-4 rounded-2xl items-center mb-8 shadow-sm"
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-primary-foreground font-bold text-lg">
              Sign in
            </Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center items-center mt-2">
          <Text className="text-muted-foreground text-base">
            Don't have an account?{" "}
          </Text>
          <Link href="/sign-up">
            <Text className="text-primary font-bold text-base">Sign up</Text>
          </Link>
        </View>
      </Animated.View>
    </ScrollView>
  );
}
