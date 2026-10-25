Set WshShell = CreateObject("WScript.Shell")
WshShell.CurrentDirectory = "D:\open Code\cosmo_web"
WshShell.Run "cmd /c npm run dev > dev.log 2>&1", 0, False
