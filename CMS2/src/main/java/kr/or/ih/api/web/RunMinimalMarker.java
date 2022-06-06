package kr.or.ih.api.web;

import java.io.*;
import java.util.*;
import java.text.*;

public class RunMinimalMarker {
    
	public  void MakeRunMinimalMarker_option(String jobid, String filename1, String filename2) {

		//public static void main(String[] args) {

		//String jobid=args[0];

		String r_path = "/data/apache-tomcat-9.0.8/webapps/ROOT/common/r/";
		//String input_file = r_path+"result/"+jobid+"/"+jobid+"_inputdata.phy";
		String input_file1 = filename1;
		String input_file2 = filename2;
		String result_path = r_path+"marker/"+jobid+"/";

		String cmd = "perl " + r_path+"final_minimal_markers.pl "  + " " + jobid + " " + input_file1+ " " + input_file2;

		System.out.println(" RunUpgma cmd : " + cmd);
		execute(cmd);
    }

	public  void MakeRunMinimalMarker(String jobid, String filename1) {


		String r_path = "/data/apache-tomcat-9.0.8/webapps/ROOT/common/r/";
		//String input_file = r_path+"result/"+jobid+"/"+jobid+"_inputdata.phy";
		String input_file1 = filename1;
		//String input_file2 = filename2;
		String result_path = r_path+"marker/"+jobid+"/";

		String cmd = "perl " + r_path+"final_minimal_markers.pl "  + " " + jobid + " " + input_file1;

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
