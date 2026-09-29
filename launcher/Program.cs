using System;
using System.Diagnostics;
using System.IO;
using System.Net.Sockets;
using System.Threading;

namespace HavenLauncher
{
    static class Program
    {
        private const int Port = 5173;
        private const string Url = "http://localhost:5173/";
        private const string ProjectDir = @"d:\HAVEN";

        [STAThread]
        static void Main()
        {
            try
            {
                if (!IsPortOpen(Port))
                {
                    StartServer();
                    for (int i = 0; i < 20; i++)
                    {
                        Thread.Sleep(500);
                        if (IsPortOpen(Port))
                        {
                            break;
                        }
                    }
                }

                // Open default browser with HAVEN URL
                Process.Start(new ProcessStartInfo
                {
                    FileName = Url,
                    UseShellExecute = true
                });
            }
            catch (Exception ex)
            {
                try
                {
                    File.AppendAllText(Path.Combine(ProjectDir, @"launcher\haven_launcher.log"), 
                        DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + " " + ex.ToString() + Environment.NewLine);
                }
                catch { }
            }
        }

        static bool IsPortOpen(int port)
        {
            try
            {
                using (var client = new TcpClient())
                {
                    var result = client.BeginConnect("127.0.0.1", port, null, null);
                    bool success = result.AsyncWaitHandle.WaitOne(TimeSpan.FromMilliseconds(500));
                    if (!success) return false;
                    client.EndConnect(result);
                    return true;
                }
            }
            catch
            {
                return false;
            }
        }

        static void StartServer()
        {
            string nodePath = @"C:\Program Files\nodejs\node.exe";
            if (!File.Exists(nodePath))
            {
                nodePath = "node.exe";
            }

            string serveJs = Path.Combine(ProjectDir, @"launcher\serve.js");

            var startInfo = new ProcessStartInfo
            {
                FileName = nodePath,
                Arguments = "\"" + serveJs + "\"",
                WorkingDirectory = ProjectDir,
                CreateNoWindow = true,
                UseShellExecute = false,
                WindowStyle = ProcessWindowStyle.Hidden
            };

            Process.Start(startInfo);
        }
    }
}
