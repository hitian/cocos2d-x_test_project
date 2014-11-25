<?php
/**
 * android crash 日志解析工具
 * 用于解析http://crash.testin.cn/ 捕捉到的崩溃线程堆栈. {官方的解析太弱了, 大部分都无法解析}...
 */
//请先将 arm-linux-androideabi-addr2line 所在的目录添加到PATH 中.
//osx 的在 android_ndk/toolchains/arm-linux-androideabi-4.8/prebuilt/darwin-x86_64/bin 中

//run:  php -S localhost:8080

$so_path = "/Users/jia/project_package/so";

$dir_list = get_version_list();

if ($_POST) {
    $path = $_POST['path'];
    $_SESSION['path'] = $path;

    $filename = $so_path . $path . "/libcocos2djs.so";

    $log = $_POST['log'];
    $arr = explode("\n", $log);

    foreach($arr as $line) {
        $line = trim($line);
        echo $line . "<br/>";
        $test_preg1 = "/^\d{1,}\s{1,}libcocos2djs.so\s{1,}\+\s{1,}0x\w{0,}$/";
        if (preg_match($test_preg1, $line)) {
            preg_match("/0x\w{1,}/", $line, $matches);

            echo "=>" . $matches[0] ."<br />";
            $command = "arm-linux-androideabi-addr2line -C -f -e " . $filename . " " . $matches[0];
            $output = shell_exec($command);
            echo "<span style='color: green'>" . nl2br($output) . "</span>";
            echo "<br />";
        }
    }

    // echo $log;

}
echo '<form method="POST">';
echo '<select name="path">';
foreach($dir_list as $dir) {
    if ($_SESSION['path'] == $dir) {
        echo '<option value="'.$dir.'" selected="selected">'.$dir.'</option>';
    } else {
        echo '<option value="'.$dir.'">'.$dir.'</option>';
    }
}
echo '</select><br />';
echo <<<EOF
<textarea name="log" cols="90", rows="20"></textarea>
<br />
<input type="submit">
</form>
EOF;



//print_r($dir_list);

function get_version_list() {
    global $so_path;
    $dir = $so_path;
    if(!is_dir($dir)) # 如果$dir变量不是一个目录，直接返回false
        return false;
    $dirs[] = '';     # 用于记录目录
    while(list($k,$path)=each($dirs))
    {
        $absDirPath = "$dir/$path";     # 当前要遍历的目录的绝对路径
        $handle = opendir($absDirPath); # 打开目录句柄
        readdir($handle);               # 先调用两次 readdir() 过滤 . 和 ..
        readdir($handle);               # 避免在 while 循环中 if 判断
        while(false !== $item=readdir($handle))
        {
            $relPath = "$path/$item";   # 子项目相对路径
            $absPath = "$dir/$relPath"; # 子项目绝对路径
            if(is_dir($absPath))        # 如果是一个目录，则存入到数组 $dirs
                $dirs[] = $relPath;
        }
        closedir($handle); # 关闭目录句柄
    }
    return $dirs;
}
