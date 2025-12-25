import { useMutation } from '@tanstack/react-query';
import Link  from 'next/link';
import React from 'react'
import { DeleteProjectAPI } from '../api/project.api';

import { useProjectStore } from '../stores/project.store';


interface ProjectCardProps {
  id: string;
  name: string;
  users: string;
  createdOn: string;
  onClick?: () => void;
}

const ProjectCard = ({name, users, id, createdOn, onClick}:ProjectCardProps) => {
  const projectStore = useProjectStore()

  const deleteMutation = useMutation({
    mutationFn: DeleteProjectAPI,
    onSuccess: (data) => {
      if(data.ok){
        projectStore.removeProject(id)
      }
    },
    onError: (err) => {

    }
  })

  const months:string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const createdDate = createdOn.split('T')[0].split('-');

  return (
    <div className='bg-foreground w-56 h-56 rounded-xl gap-1 border border-border flex flex-col items-center justify-between select-none text-white px-2 py-2 cursor-pointer'>
      <Link href={`/view-project/${id}`} className='flex flex-col items-start justify-center gap-1 w-full' onClick={() => onClick?.()}>
        <span className='font-semibold text-3xl'>{name}</span>
        <span className='text-medium text-lg text-gray-500'>Users: {users}</span>
        <span className='text-medium text-gray-500'>Created On: {months[parseInt(createdDate[1]) - 1]} {createdDate[2]}, {createdDate[0]}</span>
      </Link>

      <div className='w-full flex items-center justify-end py-2 px-2'>
        <button className='bg-red-800 text-black px-6 py-1 rounded-lg outline-none cursor-pointer font-medium hover:bg-red-900 transition-all duration-300 active:scale-95' onClick={() => deleteMutation.mutate(id)}>{deleteMutation.isPending?"Deleting...":"Delete"}</button>
      </div>
    </div>
  )
}

export default ProjectCard