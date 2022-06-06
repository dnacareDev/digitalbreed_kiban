package kr.or.ih.api.web;

import java.util.Date;

import org.springframework.stereotype.Controller;

@Controller
public class FileController
{
	public String ChangeFileName(String extension)
	{
		String fileName = "";
		
		Date date = new Date();
		
		fileName = date.getTime() + "." + extension;
		
		return fileName;
	}
	
	/*
	// 파일 내려받기
	@ResponseBody
	@RequestMapping("downloadFile")
	public ResponseEntity<Object> DownloadFile(@RequestParam("uploads_file") String uploads_file)
	{
		String path = "upload/" + uploads_file;
		
		try
		{
			Path filePath = Paths.get(path);
			Resource resource = new InputStreamResource(Files.newInputStream(filePath)); // 파일 resource 얻기
			
			File file = new File(path);
			
			HttpHeaders headers = new HttpHeaders();
			headers.setContentDisposition(ContentDisposition.builder("attachment").filename(file.getName()).build());  // 내려받기 되거나 로컬에 저장되는 용도로 쓰이는지를 알려주는 헤더
			
			return new ResponseEntity<Object>(resource, headers, HttpStatus.OK);
		}
		catch(Exception e)
		{
			return new ResponseEntity<Object>(null, HttpStatus.CONFLICT);
		}
	}
	*/
}