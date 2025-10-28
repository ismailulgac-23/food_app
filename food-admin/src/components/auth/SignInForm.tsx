import { useState } from "react";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { authAPI } from "../../services/api";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const res: any = await authAPI.login({ username, password });
      localStorage.setItem("admin_token", res.data.data.token);
      window.location.href = "/";
    } catch (err: any) {
      setError(err.response?.data?.error || "Giriş başarısız");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              UYMAR MARKET Yönetim Girişi
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Lütfen kullanıcı adınız ve parolanız ile giriş yapınız.
            </p>
          </div>
          <div>
            {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
            <form onSubmit={onSubmit}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Kullanıcı Adı <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input value={username} onChange={(e: any) => setUsername(e.target.value)} placeholder="uymar2025" />
                </div>
                <div>
                  <Label>
                    Parola <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e: any) => setPassword(e.target.value)}
                      placeholder="Parola"
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>
                <div>
                  <Button className="w-full" size="sm" disabled={loading}>
                    {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
                  </Button>
                </div>
              </div>
            </form>
            <div className="mt-5 text-center text-sm text-gray-500">UYMAR MARKET</div>
          </div>
        </div>
      </div>
    </div>
  );
}
