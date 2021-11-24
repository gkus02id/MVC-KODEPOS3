# MVC-KODEPOS3
 APLIKASI KODEPOS C# MVC

## Getting Started

Project ini berisi modul master KodePos berbasis web menggunakan C# MVC 4.5

Settingan : 
- AREADB.bak = contoh master database sql server
- User untuk akses ke aplikasi :
  * Username : TEST 
  * Password : TEST
- Konfigurasi Website terletak di file Web.config dengan detail sebagai berikut :
  <appSettings>
    <add key="dbserver" value="NAMA SERVER SQL SERVER" />
    <add key="dbhost" value="Nama Service SQL SERVER" />
    <add key="dbuser" value="User SQL SERVER" />
    <add key="dbpass" value="Password SQL SERVER" />
    <add key="dbname" value="Nama Database SQL SERVER" />
    <add key="logDir" value="Path untuk meletakkan log apliasi" /> (Contoh : D:\\www\\afsys\\afsys\\logs\\)
    <add key="percent_zoom_layout" value="Untuk melakukan skala percent layout website" /> (Contoh : 80)
   </appSettings>
