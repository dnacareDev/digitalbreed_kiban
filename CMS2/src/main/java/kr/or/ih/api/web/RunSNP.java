package kr.or.ih.api.web;

import java.io.*;
import java.util.*;
import java.text.*;

public class RunSNP {
    
	public void MakeRunSNP(String jobid, String refdb_path, String samplesname, String first_filename, String second_filename){

		/*public static void main(String[] args) {

		String jobid =args[0];
		String refdb_path =args[1];
		String samplesname =args[2];
		String first_filename =args[3];
		String second_filename =args[4];*/

		//java bms.RunSNP 2022111214317 /data/apache-tomcat-9.0.8/webapps/ROOT/digit/common/r/result/202211016440/202211016440.fa  "a b" "A_1.fastq B_1" "A_2.fastq B_2.fastq"

		refdb_path = refdb_path.replace("digit/","");

		//String work_dir ="/data/apache-tomcat-9.0.8/webapps/ROOT/common/r/result/"+jobid+"/";

		String work_dir =refdb_path.substring(0, refdb_path.lastIndexOf("/"))+"/";

		String out_work_dir =refdb_path.substring(refdb_path.lastIndexOf("/")+1, refdb_path.lastIndexOf("."));

		File file = new File(refdb_path+".fai");
		System.out.println(refdb_path+".fai");

		boolean isExists = file.exists();
		if(!isExists) {
			String cmd_index = "python3  /data/apache-tomcat-9.0.8/webapps/ROOT/common/web/snpanalysis/AT00_refIndex.py -r  "+ refdb_path + " -o " + out_work_dir;
			System.out.println(" cmd_index cmd : " + cmd_index);

			execute(cmd_index);
		}

		String cmd = "python3 /data/apache-tomcat-9.0.8/webapps/ROOT/common/web/snpanalysis/AT01_qcPrepro.py  -m snp -o " +  jobid + " -r " + refdb_path + " -s " + samplesname + " -p1 " + first_filename + " -p2 " + second_filename;
		System.out.println(" RunUpgma cmd : " + cmd);
		execute(cmd);
    }

	 public static void execute(String cmd) {
        Process process = null;
        Runtime runtime = Runtime.getRuntime();
        StringBuffer successOutput = new StringBuffer(); // suc string buffer
        StringBuffer errorOutput = new StringBuffer(); //  err string buffer
        BufferedReader successBufferReader = null; // suc buffer
        BufferedReader errorBufferReader = null; //  err buffer
        String msg = null; // msg
 
        List<String> cmdList = new ArrayList<String>();
 
		cmdList.add("/bin/sh");
		cmdList.add("-c");
        
        // cmd setting
        cmdList.add(cmd);
		   String[] array = cmdList.toArray(new String[cmdList.size()]);
 
		   try { 
            // cmd exec
            process = runtime.exec(array);

			successBufferReader = new BufferedReader(new InputStreamReader(process.getInputStream(), "EUC-KR"));
 
            while ((msg = successBufferReader.readLine()) != null) {
                //successOutput.append(msg + System.getProperty("line.separator"))
				System.out.println(msg);
            }
 
            errorBufferReader = new BufferedReader(new InputStreamReader(process.getErrorStream(), "EUC-KR"));
           
			while ((msg = errorBufferReader.readLine()) != null) {
                //errorOutput.append(msg + System.getProperty("line.separator"));
				System.out.println(msg);
            }

			process.waitFor();
 
            if (process.exitValue() == 0) {
                System.out.println("Success "+"\n");
                //System.out.println(successOutput.toString());
            } else {
                System.out.println("Fail "+"\n");
                //System.out.println(errorOutput.toString());
            }
  
        } catch (IOException e) {
        	System.out.println("error");
        } catch (InterruptedException e) {
        	System.out.println("error");
        } finally {
            try {
            	//process.destroy();
            	if (process != null) process.destroy();
                if (successBufferReader != null) successBufferReader.close();
                if (errorBufferReader != null) errorBufferReader.close();
            } catch (IOException e1) {
            	System.out.println("error");
            }
        }
    }
}