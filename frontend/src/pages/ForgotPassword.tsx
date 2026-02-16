import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/supabaseClient.js";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) throw error;

            toast({
                title: "Check your email",
                description: "If an account exists for this email, you will receive a password reset link."
            });
            navigate("/login");
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to send reset link",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <div className="w-full max-w-md">
                <Link to="/" className="mb-8 flex items-center justify-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                        <Brain className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span className="text-2xl font-display font-bold text-foreground">LeadIQ</span>
                </Link>

                <Card className="shadow-lg">
                    <CardHeader className="text-center">
                        <CardTitle className="font-display text-2xl">Forgot Password</CardTitle>
                        <CardDescription>Enter your email and we'll send you a reset link</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex-col gap-4">
                            <Button className="w-full" type="submit" disabled={loading}>
                                {loading ? "Sending link…" : "Send Reset Link"}
                            </Button>
                            <Link to="/login" className="text-sm text-primary font-medium hover:underline">
                                Back to Login
                            </Link>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
}
